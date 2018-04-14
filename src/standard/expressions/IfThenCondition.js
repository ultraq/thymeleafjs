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

import LogicalExpression               from './LogicalExpression';
import UnaryExpression                 from './UnaryExpression';
import OrderedChoiceExpression         from '../../parser/OrderedChoiceExpression';
import RegularExpressionMatchProcessor from '../../parser/RegularExpressionMatchProcessor';
import Rule                            from '../../parser/Rule';

export const Condition = new Rule('Condition',
	new OrderedChoiceExpression([
		UnaryExpression.name,
		LogicalExpression.name
	])
);

/**
 * If-then condition, `if ? then`.  This is the truthy branch only of the
 * classic ternary operator.  The falsey branch is a no-op.
 * 
 * @author Emanuel Rabina
 */
export default new Rule('IfThenCondition',
	new RegularExpressionMatchProcessor(
		/^(.+)\s*\?\s*(.+)$/,
		[Condition.name, UnaryExpression.name]
	),
	([, condition, truthyBranch]) => context => {
		return condition(context) ? truthyBranch(context) : undefined;
	}
);
