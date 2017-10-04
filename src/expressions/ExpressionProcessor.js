/* 
 * Copyright 2017, Emanuel Rabina (http://www.ultraq.net.nz/)
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

// TODO: This should really be done using a parser generator like PEG.js so that
//       we can discern between the various expression syntaxes and so execute
//       the right functions for handling them.  For now, only assumed
//       expressions are supported, with separate functions for each of those
//       best guesses.

const NAVIGATION_EXPRESSION = /\$\{(.+)\}/;

/**
 * Parses and evaluates a Thymeleaf expression.
 * 
 * @param {String} expression
 * @param {Object} [context={}]
 * @return {String} The result of evaluating the expression.
 */
export function processExpression(expression, context = {}) {

	let result = NAVIGATION_EXPRESSION.exec(expression);
	if (result) {
		let [, query] = result;
		return query.split('.')
			.reduce((previousValue, queryToken) => {
				return previousValue && previousValue[queryToken];
			}, context) || '';
	}
	return expression;
}

const LINK_EXPRESSION = /@\{(.+?)(\(.+\))?\}/;

/**
 * Parses and evaluates a Thymeleaf link expression.
 * 
 * @param {String} expression
 * @param {Object} [context={}]
 * @return {String} The result of evaluating the expression.
 */
export function processLinkExpression(expression, context = {}) {

	let result = LINK_EXPRESSION.exec(expression);
	if (result) {
		let [, url, params] = result;
		if (params) {
			let paramsList = params.slice(1, -1).split(',').map(param => {
				let [lhs, rhs] = param.split('=');
				return `${lhs}=${processExpression(rhs, context)}`;
			});
			url += `?${paramsList.join('&')}`;
		}
		return url;
	}
	return expression;
}

const ITERATION_EXPRESSION = /(.+)\s*:\s*(\$\{.+\})/;

/**
 * Parses and evaluates a Thymeleaf iteration expression.
 * 
 * @param {String} expression
 * @param {Object} [context={}]
 * @return {Object} Information about the iteration expression.
 */
export function processIterationExpression(expression, context = {}) {

	let result = ITERATION_EXPRESSION.exec(expression);
	if (result) {
		let [, localValueName, navigationExpression] = result;
		return {
			localValueName,
			iterable: processExpression(navigationExpression, context)
		};
	}
	return null;
}
