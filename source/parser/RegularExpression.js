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

import InputBuffer from './InputBuffer';

/**
 * A special kind of expression that understands matched portions of regular
 * expressions to run processing over, which may lead to additional parsing
 * expressions.
 * 
 * This expression should be used sparingly as the regexes within need to take
 * care of whitespace between tokens themselves, which can be annoying.
 * 
 * @param {RegExp} expression
 * @param {Array<Matchable>} matchers
 * @return {Matchable}
 */
export const RegularExpression = (expression, matchers) => (input, parser) => {
	return input.markAndClearOrReset(() => {
		let result = input.read(expression);
		if (result) {
			let parseResults = [result[0]];
			for (let i = 1; i < result.length; i++) {
				let match = result[i];
				if (match !== undefined) {
					let parseResult = parser.parseWithExpression(new InputBuffer(match), matchers[i - 1]);
					if (parseResult === null) {
						return null;
					}
					parseResults.push(parseResult);
				}
			}
			return parseResults;
		}
		return null;
	});
};
