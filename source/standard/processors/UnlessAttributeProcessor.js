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

import {clearChildren} from '@ultraq/dom-utils';

export const NAME = 'unless';

/**
 * JS equivalent of Thymeleaf's `th:unless` attribute processor, excludes or
 * includes the current element and its children from rendering, depending on
 * the evaluation of the expression in the attribute value.
 * 
 * @author Robbie Bardijn
 */
export default class UnlessAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `unless` name and supplied prefix.
	 * 
	 * @param {string} prefix
	 * @param {object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
	}

	/**
	 * Processes an element that contains a `th:unless` or `data-th-unless` attribute
	 * on it, evaluating the expression for falsey/truthy, excluding/rendering the
	 * element and its children based on the result.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {string} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {string} attributeValue
	 *   The value given by the attribute.
	 * @param {object} context
	 * @return {boolean} `true` if the element was removed.
	 */
	process(element, attribute, attributeValue, context) {

		let expressionResult = context.expressionProcessor.process(attributeValue, context);
		if (expressionResult) {
			clearChildren(element);
			// TODO: element.remove()?
			element.parentNode.removeChild(element);
			return true;
		}
		return super.process(element, attribute, attributeValue, context);
	}
}
