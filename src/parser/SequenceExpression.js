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
 * A sequence expression represents a series of expressions that must be matched
 * in order to consider the entire expression a match.
 * 
 * @author Emanuel Rabina
 */
export default class SequenceExpression {

	/**
	 * @param {...Matchable} expressions
	 */
	constructor(...expressions) {

		this.expressions = expressions;
	}

	/**
	 * Attempts to match each expression in order.
	 * 
	 * @param {InputBuffer} input
	 * @param {Parser} parser
	 * @return {Array}
	 */
	match(input, parser) {

		return input.markAndClearOrReset(() => {
			let results = [];
			for (let expression of this.expressions) {
				let result = input.markAndClearOrReset(() => {
					return parser.parseWithExpression(input, expression);
				});
				if (result === null) {
					return null;
				}
				results.push(result);
			}
			return results;
		});
	}
}
