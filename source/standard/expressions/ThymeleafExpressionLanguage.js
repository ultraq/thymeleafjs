/* 
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AllInput}          from './AllInput.js';
import ExpressionProcessor from './ExpressionProcessor.js';
import ThymeleafRule       from './ThymeleafRule.js';
import Grammar             from '../../parser/Grammar.js';
import {
	Optional,
	OneOrMore,
	OrderedChoice,
	Sequence,
	ZeroOrMore
}                          from '../../parser/Operators.js';
import {RegularExpression} from '../../parser/RegularExpression.js';
import { getByPath }       from '../../utilities/getByPath';

import {flatten, remove} from '@ultraq/array-utils';

// For helping identify rules that return objects
const METADATA_FRAGMENT  = 'fragment';
const METADATA_ITERATION = 'iteration';
const METADATA_MESSAGE   = 'message';

/**
 * Grammar for the Thymeleaf expression language.  Describes the language and
 * how to parse it.
 * 
 * @author Emanuel Rabina
 */
const ThymeleafExpressionLanguage = new Grammar('Thymeleaf Expression Language',

	// Ordered as at https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#standard-expression-syntax
	new ThymeleafRule('ThymeleafExpression',
		OrderedChoice(
			AllInput('VariableExpression'),
			AllInput('MessageExpression'),
			AllInput('LinkExpression'),
			AllInput('FragmentExpression'),
			AllInput('Iteration'),
			AllInput('StringConcatenation'),
			AllInput('ScopedVariables'),
			AllInput('Literal'),
			AllInput('LogicalExpression'),
			AllInput('IfThenCondition'),
			AllInput('IfThenElseCondition'),
			AllInput('TokenLiteral'),
			AllInput('Nothing')
		)
	),


	// Simple expressions
	// ==================

	/**
	 * Variable expressions, `${variable}`.  Represents a value to be retrieved
	 * from the current context.  Also is an entry into the underlying expression
	 * language, so this part often extends to do what OGNL (and thus SpEL) can
	 * do.
	 */

	new ThymeleafRule('VariableExpression',
		Sequence(/\${/, 'Chain', /\}/),
		([, chain]) => context => {
			let result = chain(context);
			return result !== null && result !== undefined ? result : '';
		}
	),
	new ThymeleafRule('Chain',
		Sequence(Optional('Negation'), 'ChainLink', ZeroOrMore(Sequence(/\./, 'ChainLink'))),
		([negation, ...chain]) => context => {
			let result = flatten(chain).filter(link => link !== '.').reduce((linkContext, nextLink) => {
				if (linkContext === null || linkContext === undefined) {
					return linkContext;
				}
				return nextLink(linkContext, context);
			}, context);
			// TODO: Need a better way of applying negation - this fails when I
			//       introduce the 'not' keyword
			return typeof negation === 'function' ? !result : result;
		}
	),
	new ThymeleafRule('ChainLink',
		OrderedChoice('MethodCall', 'ArrayIndex', 'PropertyName', 'Literal')
	),

	/**
	 * Message expressions, `#{messageKey(parameters)}`.  Used for referencing
	 * text from a resource file, often for localization purposes.
	 */
	new ThymeleafRule('MessageExpression',
		Sequence(/#{/, 'MessageKey', Optional(Sequence(/\(/, Sequence('Expression', ZeroOrMore(Sequence(/,/, 'Expression'))), /\)/)), /}/),
		([, messageKey, [, messageParameters]]) => context => {
			return {
				type: METADATA_MESSAGE,
				key: messageKey(context),
				parameters: messageParameters ?
					flatten(messageParameters)
						.filter(messageParameter => typeof messageParameter === 'function')
						.map(messageParameter => messageParameter(context)) :
					null
			};
		}
	),
	new ThymeleafRule('MessageKey', /[\w.-]+/),

	/**
	 * Link expressions, `@{url(parameters)}`.  Used for generating URLs out of
	 * context parameters.
	 * 
	 * TODO: Change this to use the other expression types so I can remove this
	 *       bespoke operator.
	 */
	new ThymeleafRule('LinkExpression',
		RegularExpression(/^@\{(.+?)(\(.+\))?\}$/, ['Url', 'UrlParameters']),
		([, urlFunc, parameters]) => context => {

			let url = urlFunc(context);
			if (parameters) {

				// TODO: Push this parsing of the parameters list back into the grammar
				let expressionProcessor = new ExpressionProcessor(ThymeleafExpressionLanguage);
				let paramsList = parameters(context).slice(1, -1).split(',').map(param => {
					let [lhs, rhs] = param.split('=');
					return [lhs, expressionProcessor.process(rhs, context)];
				});

				// Fill out any placeholders in the URL from the parameters
				while (true) { // eslint-disable-line
					let urlTemplate = /(.*?)\{(.+?)\}(.*)/.exec(url);
					if (urlTemplate) {
						let [, head, placeholder, tail] = urlTemplate;
						let paramEntry = remove(paramsList, ([lhs]) => lhs === placeholder);
						if (paramEntry) {
							url = `${head}${paramEntry[1]}${tail}`;
						}
					}
					else {
						break;
					}
				}

				// Remaining parameters become search query parameters
				if (paramsList.length) {
					url += `?${paramsList.map(([key, value]) => `${key}=${value}`).join('&')}`;
				}
			}
			return url;
		}
	),
	new ThymeleafRule('Url', /.+/),
	new ThymeleafRule('UrlParameters', /\((.+)\)/),

	/**
	 * Fragment expressions, `~{template :: fragment(parameters)}`.  A locator for
	 * a piece of HTML in the same or another template.
	 */
	new ThymeleafRule('FragmentExpression',
		Sequence(/~{/, 'TemplateName', /::/, 'FragmentName', Optional('FragmentParametersSection'), /}/),
		([, templateName, , fragmentName, parameters]) => context => {

			// TODO: Should executing a fragment expression locate and return the
			//       fragment?  If so, then it'll make expression execution
			//       asynchronous!
			return {
				type: METADATA_FRAGMENT,
				templateName: templateName(context),
				fragmentName: fragmentName(context),
				parameters: parameters ? parameters(context) : null
			};
		}
	),
	new ThymeleafRule('TemplateName',
		OrderedChoice(
			/[\w-._/]+/,
			'VariableExpression'
		)
	),
	new ThymeleafRule('FragmentName', /[\w-._]+/),
	new ThymeleafRule('FragmentParametersSection',
		Sequence(/\(/, Optional('FragmentParameters'), /\)/),
		([, parameters]) => context => {
			return parameters(context);
		}
	),
	new ThymeleafRule('FragmentParameters',
		Sequence('Expression', ZeroOrMore(Sequence(/,/, 'Expression'))),
		(expressionsAndSeparators) => context => {
			return expressionsAndSeparators ?
				flatten(expressionsAndSeparators)
					.filter(item => item !== ',')
					.map(expressions => expressions(context)) :
				[];
		}
	),


	// Complex expressions
	// ===================

	/**
	 * Iteration, `localVar : ${collection}`.  The name of the variable for each
	 * loop, followed by the collection being iterated over.
	 */
	new ThymeleafRule('Iteration',
		Sequence('Identifier', Optional(Sequence(/,/, 'Identifier')), /:/, 'VariableExpression'),
		([localValueName, [, iterationStatusVariable], , collectionExpressionAction]) => context => ({
			type: METADATA_ITERATION,
			localValueName: localValueName(context),
			iterable: collectionExpressionAction(context),
			iterationStatusVariable: iterationStatusVariable ? iterationStatusVariable(context) : null
		})
	),

	/**
	 * Scoped variable aliases, `key=${expression},...`, describes one or more
	 * names for scoped variables with the expressions that can be their values.
	 */
	new ThymeleafRule('ScopedVariables',
		Sequence('ScopedVariable', ZeroOrMore(Sequence(/,/, 'ScopedVariable'))),
		(aliases) => context => {
			return flatten(aliases).map(alias => alias(context));
		}
	),
	new ThymeleafRule('ScopedVariable',
		Sequence('Identifier', /=/, 'Expression'),
		([name, , expression]) => context => ({
			name: name(context),
			value: expression(context)
		})
	),

	// Literals
	// ========

	new ThymeleafRule('Literal',
		OrderedChoice(
			'StringLiteral',
			'NumberLiteral',
			'BooleanLiteral',
			'NullLiteral'
		)
	),

	/**
	 * String literal, characters surrounded by `'` (single quotes).
	 * 
	 * This is trying to emulate negative lookbehind so that escaped quotes don't
	 * get counted as string terminators, but JavaScript only got that feature in
	 * ES2018, so if I used it it'd leave too many JS engines without support.
	 */
	new ThymeleafRule('StringLiteral', /'.*?(?!\\').'/, result => () => result.slice(1, -1).replace(/\\/g, '')),

	/**
	 * A number.
	 */
	new ThymeleafRule('NumberLiteral', /\d+(\.\d+)?/, result => () => parseFloat(result)),

	/**
	 * One of `true` or `false`.
	 */
	new ThymeleafRule('BooleanLiteral', /(true|false)/, result => () => result === 'true'),

	/**
	 * The word `null` to represent the null value.
	 */
	// TODO: The parser uses null to mean 'failed parse', so this might not work?
	new ThymeleafRule('NullLiteral', /null/, () => () => null),

	/**
	 * A token literal, which is pretty much anything else that can't be categorized
	 * by the other literal types.  This is often used as a fallback in the
	 * expression language so that, for any unknown input, we're still returning
	 * something.
	 */
	new ThymeleafRule('TokenLiteral', /[^: ${}]+/, result => () => result),


	// Text operations
	// ===============


	/**
	 * String concatenation, `'...' + '...'` or even `${...} + ${...}`, the
	 * joining of 2 expressions by way of the `+` operator.
	 */
	new ThymeleafRule('StringConcatenation',
		Sequence('Concatenatable', OneOrMore(Sequence(/\+/, 'Concatenatable'))),
		(values) => context => {
			return flatten(values).filter(item => item !== '+').reduce((result, value) => {
				return result + (typeof value === 'function' ? value(context) : value);
			}, '');
		}
	),
	new ThymeleafRule('Concatenatable',
		OrderedChoice(
			'StringLiteral',
			'VariableExpression'
		)
	),

	new ThymeleafRule('LiteralSubstitution', Sequence(/^\|/, OneOrMore(Sequence(/[^$|]*/, 'VariableExpression', /[^$|]*/)), /\|$/), ([, matchers]) => context => {
		return flatten(matchers).reduce((curr, acc) => {
			if (typeof acc === 'string') {
				return curr + acc;
			}
			return curr + acc(context);
		}, '');
	}),


	// Arithmetic operations
	// =====================


	// Boolean operations
	// ==================

	new ThymeleafRule('LogicalOperation',
		OrderedChoice('LogicalAndOperation', 'LogicalOrOperation')
	),
	new ThymeleafRule('LogicalAndOperation',
		Sequence('Expression', 'LogicalAndOperator', 'Expression'),
		([leftOperand, , rightOperand]) => context => {
			let lhs = leftOperand(context);
			let rhs = rightOperand(context);
			return lhs && rhs;
		}
	),
	new ThymeleafRule('LogicalAndOperator',
		OrderedChoice(/&&/, /and/)
	),
	new ThymeleafRule('LogicalOrOperation',
		Sequence('Expression', 'LogicalOrOperator', 'Expression'),
		([leftOperand, , rightOperand]) => context => {
			let lhs = leftOperand(context);
			let rhs = rightOperand(context);
			return lhs || rhs;
		}
	),
	new ThymeleafRule('LogicalOrOperator',
		OrderedChoice(/\|\|/, /or/)
	),

	new ThymeleafRule('Negation', /!/),


	// Comparisons and equality
	// ========================

	/**
	 * An operation for comparing the equality of each side of the operator.
	 */
	new ThymeleafRule('EqualityOperation',
		Sequence('Expression', 'EqualityOperator', 'Expression'),
		([leftOperand, operator, rightOperand]) => context => {
			let lhs = leftOperand(context);
			let rhs = rightOperand(context);
			switch (operator(context)) {
				case '==':  return lhs == rhs; // eslint-disable-line
				case 'eq':
				case '===': return lhs === rhs;
				case '!=':  return lhs != rhs; // eslint-disable-line
				case 'ne':
				case '!==': return lhs !== rhs;
			}
			return false;
		}
	),
	new ThymeleafRule('EqualityOperator',
		OrderedChoice(/[=!]==?/, /eq/, /ne/)
	),


	// Conditional operators
	// =====================

	/**
	 * A logical expression is any expression that resolves to a `true`/`false`
	 * value.
	 */
	new ThymeleafRule('LogicalExpression',
		OrderedChoice(
			'EqualityOperation',
			'LogicalOperation',
			'Expression'
		)
	),

	/**
	 * If-then condition, `if ? then`.  This is the truthy branch only of the
	 * classic ternary operator.  The falsey branch is a no-op.
	 */
	new ThymeleafRule('IfThenCondition',
		Sequence('LogicalExpression', /\?/, 'Expression'),
		([condition, , truthyExpression]) => context => {
			return condition(context) ? truthyExpression(context) : undefined;
		}
	),

	/**
	 * If-then-else condition, `if ? then : else`, the classic ternary operator.
	 */
	new ThymeleafRule('IfThenElseCondition',
		Sequence('LogicalExpression', /\?/, 'Expression', /:/, 'Expression'),
		([condition, , truthyExpression, , falseyExpression]) => context => {
			return condition(context) ? truthyExpression(context) : falseyExpression(context);
		}
	),


	// Special tokens
	// ==============

	/**
	 * An expression that matches the empty string.
	 */
	new ThymeleafRule('Nothing', /^$/),


	// Common language basics
	// ======================

	new ThymeleafRule('Identifier', /[#a-zA-Z_][\w]*/),
	new ThymeleafRule('PropertyName', 'Identifier',
		(propertyName) => context => {
			let property = propertyName(context);
			return Object.prototype.hasOwnProperty.call(context, property) ? context[property] : '';
		}
	),
	new ThymeleafRule('ArrayIndex', /([\w]+)?(\[[\d]*])+/,
		(path) => context => {
			return getByPath(context, path);
		}
	),
	new ThymeleafRule('MethodCall',
		Sequence('MethodName', /\(/, Optional('MethodParameters'), /\)/),
		([name, , parameters]) => (context, parameterContext) => {
			let methodName = name(context);
			let method = context[methodName];
			if (!method) {
				console.warn(`No method '${methodName}' present on the current context.  Expression: ${context.expression}`);
				return '';
			}
			return method.apply(context, parameters(parameterContext || context));
		}
	),
	new ThymeleafRule('MethodName', 'Identifier'),
	new ThymeleafRule('MethodParameters',
		Sequence('Chain', ZeroOrMore(Sequence(/,/, 'Chain'))),
		(parametersAndSeparators) => context => {
			return parametersAndSeparators ?
				flatten(parametersAndSeparators)
					.filter(item => item !== ',')
					.map(parameter => parameter(context)) :
				[];
		}
	),

	/**
	 * Any valid unit of code that resolves to some value.
	 */
	new ThymeleafRule('Expression',
		OrderedChoice(
			'LiteralSubstitution',
			'VariableExpression',
			'StringConcatenation',
			'Literal'
		)
	)
);

export default ThymeleafExpressionLanguage;
