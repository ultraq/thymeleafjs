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
 * Parent class for all expressions.
 * 
 * @author Emanuel Rabina
 */
export default class Expression {

	/**
	 * Surround the given function with a mark and subsequent reset if the result
	 * of the function is `null` (parse failure).
	 * 
	 * @template T
	 * @param {InputBuffer} input
	 * @param {Function<T>} func
	 * @return {T}
	 */
	markAndResetOnFailure(input, func) {

		input.mark();
		let result = func();
		if (result !== null) {
			return result;
		}
		input.reset();
		return null;
	}

	/**
	 * Parses the input against the expression, returning the parse tree for the
	 * expression that successfully parsed the input.
	 * 
	 * @abstract
	 * @param {Object} parsingContext
	 * @return {Object} The parse tree that describes the input, or `null` if the
	 *   expression did not match the input.
	 */
	/* istanbul ignore next */
	parse(parsingContext) {

		throw new Error('Not implemented');
	}

	/**
	 * Discern what to do with the given expression and return the appropriate
	 * result.  An expression can either be a reference to another rule in the
	 * current grammar, or a regular expression that consumes input.
	 * 
	 * @param {Object} parsingContext
	 * @param {String|RegExp} expression
	 * @return {Object}
	 */
	parseRegularExpressionOrString(parsingContext, expression) {

		let {grammar, input} = parsingContext;

		// Name of another rule in the grammar
		if (typeof expression === 'string') {
			let ruleFromExpression = grammar.findRuleByName(expression);
			return ruleFromExpression ? ruleFromExpression.parse(parsingContext) : null;
		}

		// A regular expression that must be matched
		else {
			return input.read(expression);
		}
	}
}
