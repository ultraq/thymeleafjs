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
import InputBuffer from './InputBuffer';

/**
 * A special kind of expression that understands matched portions of regular
 * expressions to run processing over, which may lead to additional parsing
 * expressions.
 * 
 * @author Emanuel Rabina
 */
export default class RegularExpressionMatchProcessor extends Expression {

	/**
	 * Create a new match processor where each function in the list of processors
	 * is what is run for the corresponding matching group in the expression.  eg:
	 * Expression matching group 0 executes processors[0].
	 * 
	 * @param {RegExp} expression
	 * @param {Array<Function>} processors
	 */
	constructor(expression, processors) {

		super();
		this.expression = expression;
		this.processors = processors;
	}

	/**
	 * Match the regular expression to the current input.  A succesful match is
	 * only if the entire regular expression matches the remaining input.
	 * 
	 * @param {Object} parsingContext
	 * @return {Object}
	 */
	parse(parsingContext) {

		let {input} = parsingContext;
		return this.markAndResetOnFailure(input, () => {
			let read = input.read(this.expression);
			if (read) {
				let results = new RegExp(this.expression.source).exec(read);
				let parseResults = [read];
				for (let i = 1; i < results.length; i++) {
					let result = results[i];
					if (result !== undefined) {
						let parseResult = this.parseRegularExpressionOrString({
							...parsingContext,
							input: new InputBuffer(result)
						}, this.processors[i - 1]);
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
	}
}
