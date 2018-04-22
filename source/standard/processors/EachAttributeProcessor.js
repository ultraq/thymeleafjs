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

import ExpressionProcessor from '../expressions/ExpressionProcessor';
import AttributeProcessor  from '../../processors/AttributeProcessor';

/**
 * JS equivalent of Thymeleaf's `th:each` attribute processor, iterates over an
 * [iterable object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols),
 * executing a piece of template for every iteration.
 * 
 * @author Emanuel Rabina
 */
export default class EachAttributeProcessor extends AttributeProcessor {

	static NAME = 'each';

	/**
	 * Constructor, set this processor to use the `each` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, EachAttributeProcessor.NAME);
	}

	/**
	 * Processes an element that contains a `th:each`/`data-th-each` attribute,
	 * repeating the markup for every object in the iterable value.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Boolean} Whether or not the parent element needs to do a second
	 *   pass as its children have been modified by this processor.
	 */
	process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);

		let iterationInfo = new ExpressionProcessor(context).process(attributeValue);
		if (iterationInfo) {
			let {localValueName, iterable} = iterationInfo;
			let templateNode = element.cloneNode(true);

			for (let value of iterable) {
				let localClone = templateNode.cloneNode(true);
				let localVariable = {};
				localVariable[localValueName] = value;

				// TODO: Standardize this data attribute somewhere.  Shared const?
				// element.dataset not yet implemented in JSDOM (https://github.com/tmpvar/jsdom/issues/961),
				// so until then we're setting data- attributes the old-fashioned way.
				localClone.setAttribute('data-thymeleaf-local-variables', JSON.stringify(localVariable));

				element.parentElement.appendChild(localClone);
			}
		}
		element.parentElement.removeChild(element);

		return true;
	}
}
