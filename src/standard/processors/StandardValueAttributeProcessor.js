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

import {processExpression} from '../../expressions/ExpressionProcessor';
import AttributeProcessor  from '../../processors/AttributeProcessor';

import {escapeHtml} from '@ultraq/string-utils';

/**
 * JS equivalent of Thymeleaf's `th:value` attribute processor.
 * 
 * @author Emanuel Rabina
 */
export default class StandardValueAttributeProcessor extends AttributeProcessor {

	static NAME = 'value';

	/**
	 * Constructor, set this processor to use any processor and supplied prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, StandardValueAttributeProcessor.NAME);
	}

	/**
	 * Processes an element that contains a `th:value` or `data-th-value`
	 * attribute on it, replacing the `value` attribute with the result of the
	 * expression.
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

		element.value = escapeHtml(processExpression(attributeValue, context));
		element.removeAttribute(attribute);
	}
}
