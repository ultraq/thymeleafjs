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

import {remove}   from '@ultraq/array-utils';
import {navigate} from '@ultraq/object-utils';

// TODO: This should really be done using a parser generator like PEG.js so that
//       we can discern between the various expression syntaxes and so execute
//       the right functions for handling them.  For now, only assumed
//       expressions are supported, with separate functions for each of those
//       best guesses.

/**
 * Parses and evaluates a Thymeleaf expression.
 * 
 * @param {String} expression
 * @param {Object} [context={}]
 * @return {String} The result of evaluating the expression.
 */
export function processExpression(expression, context = {}) {

	let result = /\$\{(.+)\}/.exec(expression);
	if (result) {
		let [, query] = result;
		return navigate(context, query) || '';
	}
	return expression;
}

/**
 * Parses and evaluates a Thymeleaf iteration expression.
 * 
 * @param {String} expression
 * @param {Object} [context={}]
 * @return {Object} Information about the iteration expression.
 */
export function processIterationExpression(expression, context = {}) {

	let result = /(.+)\s*:\s*(\$\{.+\})/.exec(expression);
	if (result) {
		let [, localValueName, navigationExpression] = result;
		return {
			localValueName,
			iterable: processExpression(navigationExpression, context)
		};
	}
	return null;
}

/**
 * Parses and evaluates a Thymeleaf link expression.
 * 
 * @param {String} expression
 * @param {Object} [context={}]
 * @return {String} The result of evaluating the expression.
 */
export function processLinkExpression(expression, context = {}) {

	let result = /^@\{(.+?)(\(.+\))?\}$/.exec(expression);
	if (result) {
		let [, url, params] = result;
		if (params) {
			let paramsList = params.slice(1, -1).split(',').map(param => {
				let [lhs, rhs] = param.split('=');
				return [lhs, processExpression(rhs, context)];
			});

			// Fill out any placeholders in the URL from the parameters
			while (true) { // eslint-disable-line
				let urlTemplate = /(.*?)\{(.+?)\}(.*)/.exec(url);
				if (urlTemplate) {
					let [, head, placeholder, tail] = urlTemplate;
					let paramEntry = remove(paramsList, ([lhs]) => lhs === placeholder);
					if (paramEntry) {
						url = `${head}${paramEntry[1]}${tail}`;
					}
				}
				else {
					break;
				}
			}

			// Remaining parameters become search query parameters
			if (paramsList.length) {
				url += `?${paramsList.map(([key, value]) => `${key}=${value}`).join('&')}`;
			}
		}
		return url;
	}
	return expression;
}
