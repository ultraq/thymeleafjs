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

/**
 * Configurable attribute processor that sets or removes an attribute on an
 * element if the result of its expression is truthy or falsey respectively.
 * 
 * @author Emanuel Rabina
 */
export default class RemovableAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set the name of the attribute this processor will operate on.
	 * 
	 * @param {String} prefix
	 * @param {String} name
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, name, isomorphic) {

		super(prefix, name, isomorphic);
	}

	/**
	 * Processes an element that contains the configured attribute to be worked
	 * on, setting it if the expression resolves to a truthy value, or removing it
	 * if it resolves to a falsey value.
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

		let value = context.expressionProcessor.process(attributeValue, context);
		if (value) {
			element.setAttribute(this.name, value.toString());
		}
		else {
			element.removeAttribute(this.name);
		}

		return super.process(element, attribute, attributeValue, context);
	}
}

export const REMOVABLE_ATTRIBUTE_NAMES = [
	'alt',
	'class'
];
