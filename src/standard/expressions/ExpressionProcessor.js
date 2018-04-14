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
import Parser                      from '../../parser/Parser';

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
	 * @param {Object} context
	 */
	constructor(context = {}) {

		this.context = context;
	}

	/**
	 * Parse and execute the given input as a Thymeleaf expression.
	 * 
	 * @param {String} input
	 * @return {*}
	 */
	process(input) {

		// TODO: Probably don't need to create a new parser every time?
		let parser = new Parser(ThymeleafExpressionLanguage);
		let expressionAction = parser.parse(input);
		return expressionAction ? expressionAction(this.context) : null;
	}
}
