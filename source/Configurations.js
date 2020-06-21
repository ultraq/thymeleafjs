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

import StandardDialect from './standard/StandardDialect.js';

/**
 * Configuration object for the template engine.
 * 
 * @typedef {Object} Configuration
 * @property {Array<Dialect>} dialects
 *   A list of dialects to include with this instance of the template engine.
 * @property {Object} [isomorphic]
 *   An object which configures the isomorphic capabilities of the template
 *   engine.
 * @property {Function} messageResolver
 *   A function for building a message string from some external source, given a
 *   message key and optional parameters for that particular message.
 * @property {Function} templateResolver
 *   A function for returning the text of templates named by fragment
 *   expressions in templates.  Is given only 1 argument, the template name from
 *   a fragment expression, and should return a Promise of the template text.
 */

/**
 * Default configuration for the template engine, configures the standard
 * dialect with no options (uses `thjs` as the prefix).
 * 
 * @type {Configuration}
 */
export const DEFAULT_CONFIGURATION = {
	dialects: [
		new StandardDialect()
	]
};

/**
 * Standard configuration, configures the standard dialect with the `th` prefix
 * and enables isomorphic mode which enables the ability to use much of the same
 * processors across original Thymeleaf and ThymeleafJS.
 * 
 * @type {Configuration}
 */
export const STANDARD_CONFIGURATION = {
	...DEFAULT_CONFIGURATION,
	dialects: [
		new StandardDialect('th', {
			prefix: 'thjs'
		})
	]
};
