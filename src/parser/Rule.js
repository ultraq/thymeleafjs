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
 * Default expression action which is to return the result as is.
 * 
 * @template T
 * @param {T} result
 * @return {T}
 */
const defaultExpressionAction = result => {
	return result;
};

/**
 * A rule describes a string in the language.
 * 
 * @author Emanuel Rabina
 */
export default class Rule {

	/**
	 * @member {String}
	 */
	name;

	/**
	 * @member {Object
	 */
	expression;

	/**
	 * @param {String} name
	 * @param {Object} expression
	 * @param {Function} [expressionAction=defaultExpressionAction]
	 */
	constructor(name, expression, expressionAction = defaultExpressionAction) {

		this.name             = name;
		this.expression       = expression;
		this.expressionAction = expressionAction;
	}

	/**
	 * Parse the input in the current context through this rule.
	 * 
	 * @param {Object} parsingContext
	 * @return {Object}
	 */
	parse(parsingContext) {

		let parseResult = this.expression.parse(parsingContext);
		return parseResult !== null ? this.expressionAction(parseResult) : null;
	}
}
