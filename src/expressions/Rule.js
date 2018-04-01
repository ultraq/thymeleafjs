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
 * Default result -> node converter which returns the result as is.
 * 
 * @template T
 * @param {T} result
 * @return {T}
 */
function defaultNodeConverter(result) {
	return result;
}

/**
 * A rule describes a string in the language.
 * 
 * @author Emanuel Rabina
 */
export default class Rule {

	/**
	 * @param {String} name
	 * @param {Object} expression
	 * @param {Function} [nodeConverter=defaultNodeConverter]
	 */
	constructor(name, expression, nodeConverter = defaultNodeConverter) {

		this.name          = name;
		this.expression    = expression;
		this.nodeConverter = nodeConverter;
	}

	/**
	 * Parse the input in the current context through this rule.
	 * 
	 * @param {Object} parsingContext
	 * @return {Object}
	 */
	parse(parsingContext) {

		let nodes = this.expression.parse(parsingContext);
		if (nodes) {
			return this.nodeConverter(nodes);
		}
		return null;
	}
}
