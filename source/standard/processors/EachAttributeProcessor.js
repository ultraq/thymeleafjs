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

import AttributeProcessor from '../../processors/AttributeProcessor.js';

export const NAME = 'each';

/**
 * JS equivalent of Thymeleaf's `th:each` attribute processor, iterates over an
 * [iterable object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols),
 * executing a piece of template for every iteration.
 * 
 * @author Emanuel Rabina
 */
export default class EachAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `each` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
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

		super.process(element, attribute, attributeValue, context);

		let iterationInfo = context.expressionProcessor.process(attributeValue, context);
		if (iterationInfo) {
			let {localValueName, iterable} = iterationInfo;
			let templateNode = element.cloneNode(true);

			for (let value of iterable) {
				let localClone = templateNode.cloneNode(true);
				localClone.__thymeleafLocalVariables = {
					[localValueName]: value
				};
				element.parentElement.appendChild(localClone);
			}
		}
		element.parentElement.removeChild(element);

		return true;
	}
}
