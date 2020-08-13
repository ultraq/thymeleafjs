/* 
 * Copyright 2019, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import ElementProcessor    from '../../processors/ElementProcessor.js';
import {NODE_TYPE_ELEMENT} from '../../utilities/Dom.js';

export const NAME = 'block';

/**
 * Equivalent of Thymeleaf's "synthetic tag", `th:block`, which removes itself,
 * leaving the body of the tag behind.
 * 
 * @author Emanuel Rabina
 */
export default class BlockElementProcessor extends ElementProcessor {

	/**
	 * Constructor, set this processor to use the `block` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, NAME);
	}

	/**
	 * Processes an element named `th:block`, removing itself to leave its
	 * body/contents behind.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {Object} context
	 * @return {Boolean} `true` to indicate that the elements need reprocessing.
	 */
	process(element, context) {

		let parent = element.parentElement;
		while (element.firstChild) {
			let child = element.firstChild;
			parent.insertBefore(child, element);

			if (child.nodeType === NODE_TYPE_ELEMENT && element.__thymeleafLocalVariables) {
				child.__thymeleafLocalVariables = {
					...(child.__thymeleafLocalVariables || {}),
					...element.__thymeleafLocalVariables
				};
			}
		}
		parent.removeChild(element);

		return true;
	}
}
