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
'use strict';

const SIMPLE_NAMED_ITEM_EXPRESSION = /\$\{(.+)\}/;

/**
 * Parses and evaluates a Thymeleaf expression.
 * 
 * @param {String} expression
 * @param {Object} context
 * @return {String} The result of evaluating the expression.
 */
function processExpression(expression, context) {

	// TODO: This should really be done using a parser generator like PEG.js so
	//       that we can describe more complicated expressions.  For now, only
	//       named context items or verbatim string values are supported.
	let namedResults = SIMPLE_NAMED_ITEM_EXPRESSION.exec(expression);
	if (namedResults) {
		let itemValue = context ? context[namedResults[1]] : null;
		return (itemValue === null || itemValue === undefined) ? '' : itemValue;
	}
	return expression;
}

exports.processExpression = processExpression;
