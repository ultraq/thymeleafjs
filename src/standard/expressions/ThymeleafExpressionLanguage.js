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
	TemplateName}                from './FragmentExpression';
import Identifier              from './Identifier';
import IfThenCondition, {
	Condition}                   from './IfThenCondition';
import Iteration               from './Iteration';
import LinkExpression, {
	Url, UrlParameters}          from './LinkExpression';
import Literal, {
	BooleanLiteral,
	NullLiteral,
	NumberLiteral,
	TextLiteral,
	TokenLiteral}                from './Literals';
import LogicalExpression, {
	Comparator, Operand}         from './LogicalExpression';
import Nothing                 from './Nothing';
import UnaryExpression         from './UnaryExpression';
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
		new OrderedChoiceExpression([
			VariableExpression.name,
			LinkExpression.name,
			FragmentExpression.name,
			Iteration.name,
			IfThenCondition.name,
			Literal.name,
			LogicalExpression.name,
			IfThenCondition.name,
			Nothing.name
		], true)
	),

	// Ordered as at https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#standard-expression-syntax

	// Simple expressions
	VariableExpression,
	LinkExpression,
		Url,
		UrlParameters,
	FragmentExpression,
		TemplateName,
		FragmentName,
		FragmentParameters,

	// Complex expressions
	Iteration,

	// Literals
	Literal,
		TextLiteral,
		NumberLiteral,
		BooleanLiteral,
		NullLiteral,
		TokenLiteral,

	// Text operations

	// Arithmetic operations

	// Boolean operations

	// Comparisons and equality
	LogicalExpression,
		Comparator,
		Operand,

	// Conditional operators
	IfThenCondition,
		Condition,

	// Special tokens
	Nothing,

	// Common language basics
	Identifier,
	UnaryExpression
);
