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

import AttributeProcessor           from '../../processors/AttributeProcessor';
import {processIterationExpression} from '../../expressions/ExpressionProcessor';
import {clearChildren}              from '../../utilities/Dom';

const NAME = 'each';

/**
 * JS equivalent of Thymeleaf's `th:each` attribute processor, iterates over an
 * [iterable object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols),
 * executing a piece of template for every iteration.
 * 
 * @author Emanuel Rabina
 */
class StandardEachAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `each` name.
	 */
	constructor() {

		super('th', NAME);
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
	 */
	process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);

		let iterationInfo = processIterationExpression(attributeValue, context);
		if (iterationInfo) {
			let {localName, iterable} = iterationInfo;
			clearChildren(element);

			for (let value of iterable) {
				let clone = element.cloneNode(true);

				let localVariable = {};
				localVariable[localName] = value;

				// TODO: Standardize this data attribute somewhere.  Shared const?
				clone.dataset.localVariables = JSON.stringify(localVariable);

				element.appendChild(clone);
			}
		}
	}
}

StandardEachAttributeProcessor.NAME = NAME;

export default StandardEachAttributeProcessor;
