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

import ThymeleafExpressionLanguage from './ThymeleafExpressionLanguage';
import Parser from '../../expressions/Parser';

/**
 * Parses and executes Thymeleaf expressions.
 * 
 * @author Emanuel Rabina
 */
export default class ExpressionProcessor {

	/**
	 * @param {Object} context
	 */
	constructor(context = {}) {

		this.context = context;
	}

	/**
	 * Parse and execute the given input as a Thymeleaf expression.
	 * 
	 * @param {String} input
	 * @return {Object}
	 */
	process(input) {

		let parser = new Parser(ThymeleafExpressionLanguage);
		let expression = parser.parse(input);
		let result = expression.execute(this.context);
		return result;
	}
}
