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

import FragmentExpression      from './FragmentExpression';
import Iteration               from './Iteration';
import LinkExpression          from './LinkExpression';
import LogicalExpression       from './LogicalExpression';
import Nothing                 from './Nothing';
import VariableExpression      from './VariableExpression';
import IfThenCondition         from './conditionals/IfThenCondition';
import IfThenElseCondition     from './conditionals/IfThenElseCondition';
import Literal                 from './core/Literal';
import OrderedChoiceExpression from '../../parser/OrderedChoiceExpression';
import Rule                    from '../../parser/Rule';

/**
 * A special kind of expression that requires the referenced rule consume all
 * available input.
 */
class AllInputExpression {
	constructor(ruleName) {
		this.ruleName = ruleName;
	}
	match(input, parser) {
		let matchResult = parser.parseWithExpression(input, this.ruleName);
		return matchResult !== null && input.exhausted() ? matchResult : null;
	}
}

/**
 * Top-level rule for the Thymeleaf expression language, attempts to pick out
 * the type of underlying expression that consumes all of the available input.
 * 
 * @author Emanuel Rabina
 */
export default new Rule('ThymeleafExpression',
	new OrderedChoiceExpression(
		new AllInputExpression(VariableExpression.name),
		new AllInputExpression(LinkExpression.name),
		new AllInputExpression(FragmentExpression.name),
		new AllInputExpression(Iteration.name),
		new AllInputExpression(IfThenCondition.name),
		new AllInputExpression(Literal.name),
		new AllInputExpression(LogicalExpression.name),
		new AllInputExpression(IfThenCondition.name),
		new AllInputExpression(IfThenElseCondition.name),
		new AllInputExpression(Nothing.name)
	)
);
