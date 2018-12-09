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
 * Returns an expression function where the underlying expression doesn't need
 * to be matched.  Thus, optional expressions "always" match.
 * 
 * @param {Matchable} expression
 * @return {Matchable}
 */
export const Optional = expression => (input, parser) => {
	return input.markAndClearOrReset(() => {
		let result = parser.parseWithExpression(input, expression);
		return result !== null ? result : '';
	});
};

/**
 * Returns an expression function where the expression must be matched against
 * at least once to be considered a match.
 * 
 * @param {Matchable} expression
 * @return {Matchable}
 */
export const OneOrMore = (expression) => (input, parser) => {
	return input.markAndClearOrReset(() => {
		let results = [];
		while (true) {
			let result = input.markAndClearOrReset(() => {
				return parser.parseWithExpression(input, expression);
			});
			if (result) {
				results.push(result);
			}
			else {
				break;
			}
		}
		return results.length > 0 ? results : null;
	});
};

/**
 * Returns an expression function where only one of the underlying expressions
 * must be matched in order to consider the expression a match.
 * 
 * @param {...Matchable} expressions
 * @return {Matchable}
 */
export const OrderedChoice = (...expressions) => (input, parser) => {
	return input.markAndClearOrReset(() => {
		for (let expression of expressions) {
			let result = input.markAndClearOrReset(() => {
				return parser.parseWithExpression(input, expression);
			});
			if (result !== null) {
				return result;
			}
		}
		return null;
	});
};

/**
 * Returns an expression whose underlying expressions must be matched in order
 * to consider the entire expression a match.
 * 
 * @param {...Matchable} expressions
 * @return {Matchable}
 */
export const Sequence = (...expressions) => (input, parser) => {
	return input.markAndClearOrReset(() => {
		let results = [];
		for (let expression of expressions) {
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
};

/**
 * Returns an expression function where the expression can be matched a repeated
 * number of times or none at all to be considered a match.
 * 
 * @param {Matchable} expression
 * @return {Matchable}
 */
export const ZeroOrMore = (expression) => (input, parser) => {
	return input.markAndClearOrReset(() => {
		let results = [];
		while (true) {
			let result = input.markAndClearOrReset(() => {
				return parser.parseWithExpression(input, expression);
			});
			if (result) {
				results.push(result);
			}
			else {
				break;
			}
		}
		return results;
	});
};
