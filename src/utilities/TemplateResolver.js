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

import {deserialize} from './Dom';

/**
 * A template resolution function that uses the CommonJS module system of the
 * `require` function with a path to the template.
 * 
 * @param {String} templatePath
 * @return {DocumentFragment} DOM of the template at the given path, or `null`
 *   if the path didn't resolve to a template.
 */
export function resolveTemplate(templatePath) {

	// TODO: Return a promise of the template as template resolution is best done
	//       async (especially in the browser environment).

	// TODO: `templates` is a special path for recognizing templates, set up by a
	//       consuming app's webpack config, setting `resolve.alias` to the path
	//       to their templates.  This is a total hack and needs better dynamic
	//       support such as a Thymeleaf loader that can pick out other HTML to
	//       include.

	try {
		return deserialize(
			/* global ENVIRONMENT */
			ENVIRONMENT === 'browser' ?
				require(`templates/${templatePath}`) :
				require('fs').readFileSync(require('path').resolve(process.cwd(), templatePath))
		);
	}
	catch (error) {
		return null;
	}
}
