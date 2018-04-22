/* 
 * Copyright 2017, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import StandardDialect             from './standard/StandardDialect';
import LocalModuleTemplateResolver from './templateresolver/LocalModuleTemplateResolver';

export const DEFAULT_CONFIGURATION = {
	dialects: [
		new StandardDialect()
	],
	isomorphic: false,
	templateResolver: new LocalModuleTemplateResolver('templates', '.html')
};

export const STANDARD_CONFIGURATION = {
	...DEFAULT_CONFIGURATION,
	dialects: [
		new StandardDialect('th')
	],
	isomorphic: {
		prefix: 'thjs'
	}
};
