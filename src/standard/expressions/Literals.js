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

import OrderedChoiceExpression from '../../parser/OrderedChoiceExpression';
import Rule                    from '../../parser/Rule';
import SimpleExpression        from '../../parser/SimpleExpression';

/**
 * A text literal, anything that is surrounded by single-quotes (double-quotes
 * are used in HTML, so single-quotes are used).
 */
export const TextLiteral = new Rule('TextLiteral',
	new SimpleExpression(/^'.*'$/),
	result => () => {
		return result.slice(1, -1);
	}
);

/**
 * A number.
 */
export const NumberLiteral = new Rule('NumberLiteral',
	new SimpleExpression(/\d+(\.\d+)?/),
	result => () => {
		return parseFloat(result);
	}
);

/**
 * One of `true` or `false`.
 */
export const BooleanLiteral = new Rule('BooleanLiteral',
	new SimpleExpression(/(true|false)/),
	result => () => {
		return result === 'true';
	}
);

/**
 * The word `null` to represent the null value.
 */
export const NullLiteral = new Rule('NullLiteral',
	new SimpleExpression(/null/),
	() => () => {
		return null; // TODO: The parser uses null to mean 'failed parse', so this might not work?
	}
);

/**
 * A token literal, which is pretty much anything else that can't be categorized
 * by the other literal types.  This is often used as a fallback in the
 * expression language so that, for any unknown input, we're still returning
 * something.
 */
export const TokenLiteral = new Rule('TokenLiteral',
	new SimpleExpression(/[^: $\{\}]+/),
	result => () => {
		return result;
	}
);

/**
 * General literal, groups all other literals into an ordered choice so that one
 * of the proper literals is matched.  Used by other rules so that they don't
 * need to include all of the proper literals.
 */
export default new Rule('Literal',
	new OrderedChoiceExpression([
		TextLiteral.name,
		NumberLiteral.name,
		BooleanLiteral.name,
		NullLiteral.name,
		TokenLiteral.name
	])
);
