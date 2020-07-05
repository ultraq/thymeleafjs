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

import AttributeProcessor from '../../processors/AttributeProcessor.js';

export const NAME = 'remove';

/**
 * `th:remove`, used to remove the current element or select parts of it (and
 * its children).
 * 
 * @author Emanuel Rabina
 */
export default class RemoveAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `remove` name and supplied
	 * prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
	}

	/**
	 * Processes an element that contains a `th:remove`/`data-th-remove`
	 * attribute, removing the current element or parts of it based on the
	 * attribute value.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Boolean} Whether reprocessing behaviour needs to be applied, only
	 *   when the current tag has been removed.
	 */
	process(element, attribute, attributeValue, context) {

		super.process(element, attribute, attributeValue, context);

		switch (attributeValue) {
			case 'all':
				element.parentElement.removeChild(element);
				return true;
			case 'all-but-first':
				while (element.lastElementChild !== element.firstElementChild) {
					element.removeChild(element.lastElementChild);
				}
				return false;
		}
	}
}
