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

import Expression from './Expression';

/**
 * A sequence expression represents a series of expressions that must be matched
 * in order to consider the entire expression a match.
 * 
 * @author Emanuel Rabina
 */
export default class SequenceExpression extends Expression {

	/**
	 * @param {...Object} expressions
	 */
	constructor(...expressions) {

		super();
		this.expressions = expressions;
	}

	/**
	 * Attempts to parse each expression in order.
	 * 
	 * @param {Object} parsingContext
	 * @return {Array}
	 */
	parse(parsingContext) {

		let {input} = parsingContext;

		return this.markAndResetOnFailure(input, () => {
			let results = [];
			for (let expression of this.expressions) {
				let result = this.markAndResetOnFailure(input, () => {
					return this.parseRegularExpressionOrString(parsingContext, expression);
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
