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

import FragmentExpression, {
	FragmentName,
	FragmentParameters,
	TemplateName
} from './FragmentExpression';
import Identifier              from './Identifier';
import IfThenCondition, {
	VariableOrLiteral
} from './IfThenCondition';
import Iteration               from './Iteration';
import LinkExpression, {
	Url,
	UrlParameters
} from './LinkExpression';
import Literal, {
	BooleanLiteral,
	NullLiteral,
	NumberLiteral,
	TextLiteral,
	TokenLiteral
} from './Literals';
import OptionalWhitespace      from './OptionalWhitespace';
import VariableExpression      from './VariableExpression';
import Grammar                 from '../../parser/Grammar';
import OrderedChoiceExpression from '../../parser/OrderedChoiceExpression';
import Rule                    from '../../parser/Rule';

/**
 * Grammar for the Thymeleaf expression language.  Describes the language and
 * how to parse it.
 * 
 * @author Emanuel Rabina
 */
export default new Grammar('Thymeleaf Expression Language',

	new Rule('StartingRule',
		new OrderedChoiceExpression(
			VariableExpression.name,
			LinkExpression.name,
			FragmentExpression.name,
			Iteration.name,
			IfThenCondition.name,
			Literal.name
		)
	),

	// Variable expressions, ${variable}
	VariableExpression,

	// Link expressions, @{url(parameters)}
	LinkExpression,
	Url,
	UrlParameters,

	// Fragment expressions, ~{template :: fragment(parameters)}
	FragmentExpression,
	TemplateName,
	FragmentName,
	FragmentParameters,

	// Iteration, localVar : ${collection}
	Iteration,

	// Conditionals
	IfThenCondition,
	VariableOrLiteral,

	// Literals
	Literal,
	TextLiteral,
	NumberLiteral,
	BooleanLiteral,
	NullLiteral,
	TokenLiteral,

	// Common tokens
	Identifier,
	OptionalWhitespace
);
