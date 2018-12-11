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

import {AllInput}          from './AllInput';
import ExpressionProcessor from './ExpressionProcessor';
import ThymeleafRule       from './ThymeleafRule.js';
import Grammar             from '../../parser/Grammar';
import {
	Optional,
	OneOrMore,
	OrderedChoice,
	Sequence,
	ZeroOrMore
} from '../../parser/Operators';
import {RegularExpression} from '../../parser/RegularExpression';

import {flatten, remove} from '@ultraq/array-utils';

// For helping identify rules that return objects
const METADATA_FRAGMENT  = 'fragment';
const METADATA_ITERATION = 'iteration';

/**
 * Grammar for the Thymeleaf expression language.  Describes the language and
 * how to parse it.
 * 
 * @author Emanuel Rabina
 */
export default new Grammar('Thymeleaf Expression Language',

	// Ordered as at https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#standard-expression-syntax
	new ThymeleafRule('ThymeleafExpression',
		OrderedChoice(
			AllInput('VariableExpression'),
			AllInput('LinkExpression'),
			AllInput('FragmentExpression'),
			AllInput('Iteration'),
			AllInput('StringConcatenation'),
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
		([, chain]) => context => chain(context) || ''
	),
	new ThymeleafRule('Chain',
		Sequence('ChainLink', ZeroOrMore(Sequence(/\./, 'ChainLink'))),
		(chain) => context => {
			return flatten(chain).filter(link => link !== '.').reduce((accumulator, nextLink) => {
				return accumulator === null || accumulator === undefined ? accumulator : nextLink({
					...context,
					...accumulator
				});
			}, context);
		}
	),
	new ThymeleafRule('ChainLink',
		OrderedChoice('MethodCall', 'PropertyName', 'Literal')
	),

	/**
	 * Link expressions, `@{url(parameters)}`.  Used for generating URLs out of
	 * context parameters.
	 */
	new ThymeleafRule('LinkExpression',
		RegularExpression(/^@\{(.+?)(\(.+\))?\}$/, ['Url', 'UrlParameters']),
		([, urlFunc, parameters]) => context => {

			let url = urlFunc(context);
			if (parameters) {

				// TODO: Push this parsing of the parameters list back into the grammar
				let expressionProcessor = new ExpressionProcessor(context);
				let paramsList = parameters(context).slice(1, -1).split(',').map(param => {
					let [lhs, rhs] = param.split('=');
					return [lhs, expressionProcessor.process(rhs)];
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
		Sequence(/~{/, 'TemplateName', /::/, 'FragmentName', 'FragmentParameters', /}/),
		([, templateName, , fragmentName, parameters]) => context => {

			// TODO: Should executing a fragment expression locate and return the
			//       fragment?  If so, then it'll make expression execution
			//       asynchronous!
			return {
				type: METADATA_FRAGMENT,
				templateName: templateName(context),
				fragmentName: fragmentName(context),
				parameters: parameters(context)
			};
		}
	),
	new ThymeleafRule('TemplateName', /[\w-._/]+/),
	new ThymeleafRule('FragmentName', /[\w-._]+/),

	// TODO: We're not doing anything with these yet
	new ThymeleafRule('FragmentParameters',
		Optional(/\(.+\)/)
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
	 */
	new ThymeleafRule('StringLiteral', /'.*?'/, result => () => result.slice(1, -1)),

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


	// Arithmetic operations
	// =====================


	// Boolean operations
	// ==================


	// Comparisons and equality
	// ========================

	/**
	 * A logical expression is any expression that resolves to a `true`/`false`
	 * value.
	 */
	new ThymeleafRule('LogicalExpression',
		Sequence('Expression', 'Comparator', 'Expression'),
		([leftOperand, comparator, rightOperand]) => context => {
			let lhs = leftOperand(context);
			let rhs = rightOperand(context);
			switch (comparator(context)) {
				case '==':  return lhs == rhs; // eslint-disable-line
				case '===': return lhs === rhs;
			}
			return false;
		}
	),
	new ThymeleafRule('Comparator',
		OrderedChoice(
			/===?/
		)
	),


	// Conditional operators
	// =====================

	/**
	 * If-then condition, `if ? then`.  This is the truthy branch only of the
	 * classic ternary operator.  The falsey branch is a no-op.
	 */
	new ThymeleafRule('IfThenCondition',
		Sequence('Condition', /\?/, 'Expression'),
		([condition, , truthyExpression]) => context => {
			return condition(context) ? truthyExpression(context) : undefined;
		}
	),

	/**
	 * If-then-else condition, `if ? then : else`, the classic ternary operator.
	 */
	new ThymeleafRule('IfThenElseCondition',
		Sequence('Condition', /\?/, 'Expression', /:/, 'Expression'),
		([condition, , truthyExpression, , falseyExpression]) => context => {
			return condition(context) ? truthyExpression(context) : falseyExpression(context);
		}
	),

	/**
	 * A condition is some expression or value that resolves to a true/false
	 * value.
	 */
	new ThymeleafRule('Condition',
		OrderedChoice(
			'LogicalExpression',
			'Expression'
		)
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
			return context.hasOwnProperty(property) ? context[property] : '';
		}
	),
	new ThymeleafRule('MethodCall',
		Sequence('MethodName', /\(/, Optional('MethodParameters'), /\)/),
		([name, , parameters]) => context => {
			let methodName = name(context);
			let method = context[methodName];
			if (!method) {
				console.warn(`No method '${methodName}' present on the current context:`);
				console.warn(context);
				return '';
			}
			return method.apply(context, parameters(context));
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
			'VariableExpression',
			'StringConcatenation',
			'Literal'
		)
	)
);
