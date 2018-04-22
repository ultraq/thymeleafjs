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

import ExpressionProcessor             from './ExpressionProcessor';
import RegularExpressionMatchProcessor from '../../parser/RegularExpressionMatchProcessor';
import Rule                            from '../../parser/Rule';

import {remove} from '@ultraq/array-utils';

export const Url = new Rule('Url',
	/.+/
);

export const UrlParameters = new Rule('UrlParameters',
	/\((.+)\)/
);

/**
 * Link expressions, `@{url(parameters)}`.  Used for generating URLs out of
 * context parameters.
 * 
 * @author Emanuel Rabina
 */
export default new Rule('LinkExpression',
	new RegularExpressionMatchProcessor(
		/^@\{(.+?)(\(.+\))?\}$/,
		[Url.name, UrlParameters.name]
	),
	([, url, parameters]) => context => {

		if (parameters) {

			// TODO: Push this parsing of the parameters list back into the grammar
			let expressionProcessor = new ExpressionProcessor(context);
			let paramsList = parameters.slice(1, -1).split(',').map(param => {
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
);
