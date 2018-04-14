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

/**
 * An ordered choice expression contains many expressions, only one of which can
 * match in order to consider the expression a match.
 * 
 * @author Emanuel Rabina
 */
export default class OrderedChoiceExpression {

	/**
	 * @param {Array<String|RegExp>} expressions
	 * @param {Boolean} [fullInputMatch=false]
	 */
	constructor(expressions, fullInputMatch = false) {

		this.expressions    = expressions;
		this.fullInputMatch = fullInputMatch;
	}

	/**
	 * Go through each expression until a match is found.
	 * 
	 * @param {InputBuffer} input
	 * @param {Parser} parser
	 * @return {Object}
	 */
	match(input, parser) {

		return input.markAndClearOrReset(() => {
			for (let expression of this.expressions) {
				let result = input.markAndClearOrReset(() => {
					let result = parser.parseWithExpression(input, expression);
					return result !== null && this.fullInputMatch && !input.exhausted() ? null : result;
				});
				if (result !== null) {
					return result;
				}
			}
			return null;
		});
	}
}
