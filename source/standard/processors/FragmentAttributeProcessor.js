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

import AttributeProcessor from '../../processors/AttributeProcessor';

/**
 * JS equivalent of Thymeleaf's `th:fragment` attribute processor, marks an
 * element as a template fragment that can be imported by other processors like
 * `th:insert`.
 * 
 * @author Emanuel Rabina
 */
export default class FragmentAttributeProcessor extends AttributeProcessor {

	static NAME = 'fragment';

	/**
	 * Constructor, set this processor to use the `fragment` name and supplied
	 * prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, FragmentAttributeProcessor.NAME);
	}

	/**
	 * Processes an element that contains a `th:fragment` or `data-th-fragment`
	 * attribute on it.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 */
	process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);

		// TODO: Some off-context mechanism for encountered fragments?
		if (!context.fragments) {
			context.fragments = [];
		}
		context.fragments.push({
			name:    attributeValue,
			element: element.cloneNode(true)
		});
	}
}
