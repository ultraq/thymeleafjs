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

import Rule from '../../parser/Rule.js';

/**
 * A custom rule where the default match processor returns a function to execute
 * against the current context to discover the matched value.
 */
export default class ThymeleafRule extends Rule {

	/**
	 * @param {String} name
	 * @param {Object} expression
	 * @param {Function} [matchProcessor]
	 */
	constructor(name, expression, matchProcessor) {

		const contextSensitiveMatchProcessor = result => (...args) => {
			// console.log(`Processing rule: ${name}`);
			return typeof result === 'function' ? result.apply(null, args) : result;
		};
		super(name, expression, matchProcessor || contextSensitiveMatchProcessor);
	}
}
