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

import VariableExpression from './VariableExpression';
import Grammar            from '../../parser/Grammar';
import Rule               from '../../parser/Rule';
import SequenceExpression from '../../parser/SequenceExpression';
import SimpleExpression   from '../../parser/SimpleExpression';

export default new Grammar('Thymeleaf Expression Language',
	new Rule('StartingRule',
		new SimpleExpression('VariableExpression')
	),
	new Rule('VariableExpression',
		new SequenceExpression(/\${/, 'Identifier', /}/),
		result => new VariableExpression(result.join(''), result[1])
	),
	new Rule('Identifier',
		new SimpleExpression(/[a-zA-Z_][\w\.]*/)
	)
);
