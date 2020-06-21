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

import SelfRemovingAttributeProcessor from '../../processors/SelfRemovingAttributeProcessor.js';

/**
 * The `th:classappend` is a special attribute that applies the expression to
 * any existing classes already on an element.
 * 
 * @author Emanuel Rabina
 */
export default class ClassAppendAttributeProcessor extends SelfRemovingAttributeProcessor {

	static NAME = 'classappend';

	/**
	 * Constructor, set this processor to use the `attr` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 * @param {ExpressionProcessor} expressionProcessor
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, expressionProcessor, isomorphic) {

		super(prefix, ClassAppendAttributeProcessor.NAME, isomorphic);
		this.expressionProcessor = expressionProcessor;
	}

	/**
	 * Processes an element that contains a `th:classappend` or `data-th-classappend`
	 * attribute on it, adding the resulting classes to any existing classes on
	 * the current element.
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

		let classes = this.expressionProcessor.process(attributeValue, context);
		if (classes) {
			element.className += ` ${classes}`;
		}
		return super.process(element, attribute, attributeValue, context);
	}
}
