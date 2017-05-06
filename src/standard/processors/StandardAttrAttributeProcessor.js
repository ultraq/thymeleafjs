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

import AttributeProcessor  from '../../processors/AttributeProcessor';
import {processExpression} from '../../expressions/ExpressionProcessor';

import {escapeHtml} from '@ultraq/string-utils';

const NAME = 'attr';

/**
 * JS equivalent of Thymeleaf's `th:attr` attribute processor, modifies or sets
 * a target attribute to whatever its associated expression evaluates to.
 * 
 * @author Emanuel Rabina
 */
class StandardAttrAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `attr` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, NAME);
	}

	/**
	 * Processes an element that contains a `th:attr` or `data-th-attr` attribute
	 * on it, picking out the target attributes and setting them to whatever their
	 * expressions evaluate to.
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

		attributeValue.split(',').forEach(attribute => {
			let attributeParts = attribute.split('=');
			element.setAttribute(attributeParts[0], escapeHtml(processExpression(attributeParts[1], context)));
		});

		element.removeAttribute(attribute);
	}
}

StandardAttrAttributeProcessor.NAME = NAME;

export default StandardAttrAttributeProcessor;
