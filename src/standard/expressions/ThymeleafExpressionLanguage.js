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

import FragmentExpression              from './FragmentExpression';
import IterationExpression             from './IterationExpression';
import LinkExpression                  from './LinkExpression';
import LiteralExpression               from './LiteralExpression';
import VariableExpression              from './VariableExpression';
import Grammar                         from '../../parser/Grammar';
import OptionalExpression              from '../../parser/OptionalExpression';
import OrderedChoiceExpression         from '../../parser/OrderedChoiceExpression';
import RegularExpressionMatchProcessor from '../../parser/RegularExpressionMatchProcessor';
import Rule                            from '../../parser/Rule';
import SequenceExpression              from '../../parser/SequenceExpression';
import SimpleExpression                from '../../parser/SimpleExpression';

export default new Grammar('Thymeleaf Expression Language',
	new Rule('StartingRule',
		new OrderedChoiceExpression(
			'VariableExpression',
			'LinkExpression',
			'FragmentExpression',
			'IterationExpression',
			'LiteralExpression'
		)
	),

	// Variable expressions, ${variable}
	new Rule('VariableExpression',
		new SequenceExpression(/\${/, 'Identifier', /}/),
		result => new VariableExpression(result.join(''), result[1])
	),

	// Link expressions, @{url(parameters)}
	new Rule('LinkExpression',
		new RegularExpressionMatchProcessor(/^@\{(.+?)(\(.+\))?\}$/, ['Url', 'UrlParameters']),
		result => new LinkExpression(...result)
	),
	new Rule('Url',
		new SimpleExpression(/.+/)
	),
	new Rule('UrlParameters',
		new SimpleExpression(/\((.+)\)/)
	),

	// Fragment expressions, ~{template :: fragment(parameters)}
	new Rule('FragmentExpression',
		new SequenceExpression(
			/~{/,
			'TemplateName',
			'OptionalWhitespace',
			/::/,
			'OptionalWhitespace',
			'FragmentName',
			'OptionalWhitespace',
			'FragmentParameters',
			/}/),
		result => new FragmentExpression(result.join(''), result[1], result[5], result[7])
	),
	new Rule('TemplateName',
		new SimpleExpression(/[\w-\._]+/)
	),
	new Rule('FragmentName',
		new SimpleExpression(/[\w-\._]+/)
	),
	new Rule('FragmentParameters',
		new OptionalExpression(/\(.+\)/), // TODO: We're not doing anything with these yet
	),

	// Iteration, localVar : ${collection}
	new Rule('IterationExpression',
		new SequenceExpression(
			'Identifier',
			'OptionalWhitespace',
			/:/,
			'OptionalWhitespace',
			'VariableExpression'
		),
		result => new IterationExpression(result.join(''), result[0], result[4])
	),

	// This is the fallback, where everything else is returned as is
	new Rule('LiteralExpression',
		new SimpleExpression(/[^:]*/),
		result => new LiteralExpression(result)
	),

	// Common tokens
	new Rule('Identifier',
		new SimpleExpression(/[a-zA-Z_][\w\.]*/)
	),
	new Rule('OptionalWhitespace',
		new OptionalExpression(/\s+/)
	)
);
