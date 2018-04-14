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

import Identifier                      from './Identifier';
import RegularExpressionMatchProcessor from '../../parser/RegularExpressionMatchProcessor';
import Rule                            from '../../parser/Rule';

import {navigate} from '@ultraq/object-utils';

/**
 * Variable expressions, `${variable}`.  Represents a value to be retrieved from
 * the current context.
 * 
 * @author Emanuel Rabina
 */
export default new Rule('VariableExpression',
	new RegularExpressionMatchProcessor(/\${(.+)\}/, [Identifier.name]),
	([, identifier]) => context => {
		return navigate(context, identifier) || '';
	}
);
