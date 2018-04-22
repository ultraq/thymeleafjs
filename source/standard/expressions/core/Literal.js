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

import BooleanLiteral          from './BooleanLiteral';
import NullLiteral             from './NullLiteral';
import NumberLiteral           from './NumberLiteral';
import StringLiteral           from './StringLiteral';
import TokenLiteral            from './TokenLiteral';
import OrderedChoiceExpression from '../../../parser/OrderedChoiceExpression';
import Rule                    from '../../../parser/Rule';

/**
 * General literal, groups all other literals into an ordered choice so that one
 * of the proper literals is matched.  Used by other rules so that they don't
 * need to include all of the proper literals.
 */
export default new Rule('Literal',
	new OrderedChoiceExpression(
		StringLiteral.name,
		NumberLiteral.name,
		BooleanLiteral.name,
		NullLiteral.name,
		TokenLiteral.name
	)
);
