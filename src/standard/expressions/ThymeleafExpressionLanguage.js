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
	TemplateName}            from './FragmentExpression';
import Identifier          from './Identifier';
import Iteration           from './Iteration';
import LinkExpression, {
	Url, UrlParameters}      from './LinkExpression';
import LogicalExpression, {
	Comparator}              from './LogicalExpression';
import Nothing             from './Nothing';
import ThymeleafExpression from './ThymeleafExpression';
import VariableExpression  from './VariableExpression';
import Condition           from './conditionals/Condition';
import IfThenCondition     from './conditionals/IfThenCondition';
import IfThenElseCondition from './conditionals/IfThenElseCondition';
import BooleanLiteral      from './core/BooleanLiteral';
import Literal             from './core/Literal';
import NullLiteral         from './core/NullLiteral';
import NumberLiteral       from './core/NumberLiteral';
import Operand             from './core/Operand';
import StringLiteral       from './core/StringLiteral';
import TokenLiteral        from './core/TokenLiteral';
import Grammar             from '../../parser/Grammar';

/**
 * Grammar for the Thymeleaf expression language.  Describes the language and
 * how to parse it.
 * 
 * @author Emanuel Rabina
 */
export default new Grammar('Thymeleaf Expression Language',
	ThymeleafExpression,

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
		StringLiteral,
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

	// Conditional operators
	IfThenCondition,
	IfThenElseCondition,
		Condition,

	// Special tokens
	Nothing,

	// Common language basics
	Identifier,
	Operand
);
