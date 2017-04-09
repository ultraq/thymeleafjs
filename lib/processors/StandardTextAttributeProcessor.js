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
'use strict';

const AttributeProcessor  = require('./AttributeProcessor');
const {processExpression} = require('../expressions/ExpressionProcessor');

const PREFIX = 'th';
const NAME = 'text';

/**
 * JS equivalent of Thymeleaf's `th:text` attribute processor, applies the
 * expression in the attribute value to the text content of the element being
 * processed.
 * 
 * @author Emanuel Rabina
 */
class StandardTextAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `th` prefix and `text` name.
	 */
	constructor() {
		super(PREFIX, NAME);
	}

	/**
	 * Processes an element that contains a `th:text` or `data-th-text` attribute
	 * on it, taking the text expression in the value and applying it to the text
	 * content of the element.
	 * 
	 * @param {Element} element        Element being processed.
	 * @param {String}  attributeValue Value of the `th:text` attribute.
	 * @param {Object}  context
	 */
	process(element, attributeValue, context) {

		element.textContent = processExpression(attributeValue, context);
	}
}

StandardTextAttributeProcessor.PREFIX = PREFIX;
StandardTextAttributeProcessor.NAME   = NAME;

module.exports = StandardTextAttributeProcessor;
