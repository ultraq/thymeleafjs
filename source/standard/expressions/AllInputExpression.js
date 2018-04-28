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
 * A special kind of expression that requires the referenced rule consume all
 * available input.
 * 
 * @author Emanuel Rabina
 */
export default class AllInputExpression {

	/**
	 * @param {String} ruleName
	 */
	constructor(ruleName) {

		this.ruleName = ruleName;
	}

	/**
	 * Matches the input only if all input is consumed afterwards.
	 * 
	 * @param {InputBuffer} input
	 * @param {Parser} parser
	 * @return {Object}
	 */
	match(input, parser) {

		let matchResult = parser.parseWithExpression(input, this.ruleName);
		return matchResult !== null && input.exhausted() ? matchResult : null;
	}
}
