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

import {deserialize} from '../utilities/Dom';
import {promisify}   from '../utilities/Functions';

/**
 * A Thymeleaf template resolver for locating templates within the current
 * execution context, and so can be `require`d provided the full path of the
 * template is known.  Giving this resolver the prefix, template name, and
 * suffix is enough to do that module lookup.
 * 
 * @author Emanuel Rabina
 */
export default class LocalModuleTemplateResolver {

	/**
	 * Create a new module template resolver for the given prefix and suffix.
	 * 
	 * @param {String} [prefix='']
	 * @param {String} [suffix='']
	 */
	constructor(prefix = '', suffix = '') {

		this.prefix = prefix;
		this.suffix = suffix;
	}

	/**
	 * Returns a promise to be resolved with the HTML of the template module with
	 * the given name, whose path is the configured prefix, the given name, and
	 * configured suffix.
	 * 
	 * @param {String} templateName
	 * @return {Promise<DocumentFragment>}
	 */
	resolve(templateName) {

		// NOTE: Can't use async/await here otherwise the generated file `require`s
		//       the node modules, which won't work for a browser environment.

		let templatePath = this.prefix + templateName + this.suffix;

		/* global ENVIRONMENT */
		return ENVIRONMENT === 'browser' ?
			Promise.resolve(deserialize(require(templatePath))) :
			promisify(require('fs').readFile)(require('path').resolve(process.cwd(), templatePath))
				.then(templateData => {
					return deserialize(templateData);
				});
	}
}
