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
import {buildMessage}     from '../../utilities/Messages.js';

export const NAME = 'text';

/**
 * JS equivalent of Thymeleaf's `th:text` attribute processor, applies the
 * expression in the attribute value to the text content of the element being
 * processed, escaping any unsafe input.
 * 
 * @author Emanuel Rabina
 */
export default class TextAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `text` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
	}

	/**
	 * Processes an element that contains a `th:text` or `data-th-text` attribute
	 * on it, taking the text expression in the value and applying it to the text
	 * content of the element.
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
	async process(element, attribute, attributeValue, context) {

		// TODO: Move message constructon to the expression language?  Need to make
		//       all the executions async!
		let messageResult = context.expressionProcessor.process(attributeValue, context);
		element.textContent =
			typeof messageResult === 'object' ? await buildMessage(messageResult, context.messageResolver) :
			messageResult;
		return super.process(element, attribute, attributeValue, context);
	}
}
