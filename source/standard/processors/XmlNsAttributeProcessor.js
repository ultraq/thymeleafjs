/* 
 * Copyright 2020, Emanuel Rabina (http://www.ultraq.net.nz/)
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

/**
 * `xmlns:th`, used for removing the Thymeleaf XML namespace often added to HTML
 * files to satisfy the XML validators that are used to edit them.
 * 
 * @author Emanuel Rabina
 */
export default class XmlNsAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to operate on the given XML namespace.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super('xmlns', prefix);
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
	 * @return {Boolean} `false`, as removing the XML namespace never requires
	 *   repropcessing.
	 */
	process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);
		return false;
	}
}
