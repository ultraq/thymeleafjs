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

import Expression          from './Expression';
import ExpressionProcessor from './ExpressionProcessor';

import {remove} from '@ultraq/array-utils';

/**
 * A link expression is used for generating URLs out of context parameters.
 * 
 * @author Emanuel Rabina
 */
export default class LinkExpression extends Expression {

	/**
	 * @param {String} expression
	 * @param {String} url
	 * @param {Object} parameters
	 */
	constructor(expression, url, parameters) {

		super(expression);
		this.url        = url;
		this.parameters = parameters;
	}

	/**
	 * Construct the URL from the link expression, filling in any parameters with
	 * values from the context.
	 * 
	 * @param {Object} context
	 * @return {String}
	 */
	execute(context) {

		let url = this.url;

		if (this.parameters) {

			// TODO: Push this parsing of the parameters list back into the grammar
			let expressionProcessor = new ExpressionProcessor(context);
			let paramsList = this.parameters.slice(1, -1).split(',').map(param => {
				let [lhs, rhs] = param.split('=');
				return [lhs, expressionProcessor.process(rhs)];
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
}
