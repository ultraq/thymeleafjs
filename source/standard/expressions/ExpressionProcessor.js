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

import Parser from '../../parser/Parser.js';

/**
 * Parses and executes Thymeleaf expressions.
 * 
 * TODO: Create a shared instance of this for a processing context so that it
 *       doesn't need to be recreated over and over.
 * 
 * @author Emanuel Rabina
 */
export default class ExpressionProcessor {

	/**
	 * Constructor, create a new processor that can parse/execute a string in the
	 * given grammar.
	 * 
	 * @param {Grammar} grammar
	 */
	constructor(grammar) {

		this.parser = new Parser(grammar);
	}

	/**
	 * Parse and execute the given input as a Thymeleaf expression.
	 * 
	 * @param {String} input
	 * @param {Object} [context={}]
	 * @return {*}
	 */
	process(input, context = {}) {

		let expression = this.parser.parse(input);
		return expression?.({
			...context,
			expression: input
		});
	}
}
