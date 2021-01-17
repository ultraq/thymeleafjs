/* 
 * Copyright 2021, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import Grammar    from './Grammar.js';
import {
	OneOrMore,
	Optional,
	OrderedChoice,
	Sequence,
	ZeroOrMore
}                 from './Operators.js';
import Rule       from './Rule.js';
import {AllInput} from '../standard/expressions/AllInput.js';

/**
 * A grammar that describes the parser expressions, used to build parser
 * expressions.  This is getting meta...
 * 
 * @author Emanuel Rabina
 */
export default new Grammar('Parsing Expression Grammar', [
	new Rule('StartingRule',
		AllInput('Expression')
	),
	new Rule('Expression',
		OrderedChoice(
			'NonTerminals',
			'Terminals'
		)
	),

	// Base expressions
	// ================

	new Rule('Terminals',
		OrderedChoice(
			'RegularExpression',
			'String'
		)
	),
	new Rule('RegularExpression',
		/\/.+?\//,
		(e) => {
			return 'RegularExpression';
		}
	),
	new Rule('String',
		/[^'"`*+?]*/,
		(e) => {
			return 'String';
		}
	),

	// Combination expressions
	// =======================

	new Rule('NonTerminals',
		OrderedChoice(
			'SequenceExpression',
			'OrderedChoiceExpression',
			'ZeroOrMoreExpression',
			'OneOrMoreExpression',
			'OptionalExpression'
		)
	),
	new Rule('SequenceExpression',
		Sequence('Expression', / /, 'Expression'),
		([e1, e2]) => {
			return Sequence(e1, e2);
		}
	),
	new Rule('OrderedChoiceExpression',
		Sequence('Expression', /\//, 'Expression'),
		([e1, , e2]) => {
			return OrderedChoice(e1, e2);
		}
	),
	new Rule('ZeroOrMoreExpression',
		Sequence('Expression', /\*/),
		([e]) => {
			return ZeroOrMore(e);
		}
	),
	new Rule('OneOrMoreExpression',
		Sequence('Expression', /\+/),
		([e]) => {
			return OneOrMore(e);
		}
	),
	new Rule('OptionalExpression',
		Sequence('Expression', /\?/),
		([e]) => {
			return Optional(e);
		}
	)
], true);
