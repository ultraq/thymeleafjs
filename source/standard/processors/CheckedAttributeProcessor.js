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

import AttributeProcessor from '../../processors/AttributeProcessor.js';

export const NAME = 'checked';

/**
 * Thymeleaf's `th:checked` attribute processor, sets or removes the `checked`
 * attribute from an element based on the result of the expression within it.
 * 
 * TODO: This is one of HTML5s "boolean attributes", attributes whose values are
 *       true simply by being present in the element, regardless of the value
 *       inside it.  To act as false, the attribute has to be removed.  Find a
 *       way to generate these from some list of boolean attributes so that I
 *       don't need to write a class for each one!
 * 
 * @author Emanuel Rabina
 */
export default class CheckedAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `checked` name and supplied
	 * prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
	}

	/**
	 * Processes an element that contains a `th:checked` or `data-th-checked`
	 * attribute on it, either setting or removing a `checked` attribute to the
	 * current element based on the result of the inner expression.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Boolean} `false`.
	 */
	process(element, attribute, attributeValue, context) {

		let result = context.expressionProcessor.process(attributeValue, context);
		if (result) {
			element.setAttribute('checked', '');
		}
		else {
			element.removeAttribute('checked');
		}

		return super.process(element, attribute, attributeValue, context);
	}
}
