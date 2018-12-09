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
 * Any one of the objects that can be matched:
 *  - an expression function
 *  - a string that references another rule
 *  - a regular expression
 * 
 * @typedef {String|RegExp|Function} Matchable
 */

/**
 * A recursive descent parser for any parsing expression grammar defined by the
 * constructs in this module.
 * 
 * TODO: Own module?
 * 
 * @author Emanuel Rabina
 */
export default class Parser {

	expressionStack = [];

	/**
	 * @param {Grammar} grammar
	 */
	constructor(grammar) {

		this.grammar = grammar;
	}

	/**
	 * Parse a string, attempting to build the parse tree defined by the rules in
	 * the configured grammar.  Parsing is considered successful when there are no
	 * more non-terminating symbols in the grammar and all of the input has been
	 * read.
	 * 
	 * @param {String} input
	 * @return {Object} The parse tree if the input could be parsed, `null`
	 *   otherwise.
	 */
	parse(input) {

		let inputBuffer = new InputBuffer(input);
		let matchResult = this.grammar.accept(inputBuffer, this);
		if (matchResult === null || !inputBuffer.exhausted()) {
			let errorMessage = `Failed to parse "${input}"`;

			// Don't bring down the thread if we can't parse
			if (process.env.NODE_ENV === 'production') {
				console.error(errorMessage);
				return null;
			}
			else {
				throw new Error(errorMessage);
			}
		}
		return matchResult;
	}

	/**
	 * Parse the input against the given expression.  An expression can either be
	 * a reference to another rule in the current grammar, or a regular expression
	 * that consumes input.
	 * 
	 * @param {InputBuffer} input
	 * @param {Matchable} expression
	 * @return {Object}
	 */
	parseWithExpression(input, expression) {

		// Name of another rule in the grammar
		if (typeof expression === 'string') {
			let rule = this.grammar.findRuleByName(expression);
			return rule ? rule.accept(input, this) : null;
		}

		// A regular expression that must be matched
		else if (expression instanceof RegExp) {
			let result = input.read(expression);
			if (result) {
				return result[0];
			}
		}

		// An expression function to be executed
		else if (typeof expression === 'function') {
			return expression(input, this);
		}

		return null;
	}

	/**
	 * Surrounds a function that evaluates an expression with tracking it against
	 * the current stack.  Useful for knowing how the current expression was
	 * arrived at through the grammar's rules.
	 * 
	 * @template T
	 * @param {InputBuffer} input
	 * @param {Matchable} expression
	 * @param {String} name
	 * @param {Function<T>} func
	 * @return {T}
	 */
	trackExpression(input, expression, name, func) {

		let stackSize = this.expressionStack.push({
			name,
			expression: typeof expression !== 'function' ? expression.toString() : null,
			input: input.input.substring(input.position)
		});
		let result = func();
		if (result !== null) {
			return result;
		}
		this.expressionStack.splice(stackSize - 1);
		return null;
	}
}
