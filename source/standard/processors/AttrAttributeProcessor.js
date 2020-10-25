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

import {escapeHtml} from '@ultraq/string-utils';

export const NAME = 'attr';

/**
 * JS equivalent of Thymeleaf's `th:attr` attribute processor, modifies or sets
 * a target attribute to whatever its associated expression evaluates to.
 * 
 * @author Emanuel Rabina
 */
export default class AttrAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `attr` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
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
	 * @return {Boolean} `false`.
	 */
	process(element, attribute, attributeValue, context) {

		// TODO: This regex, is this some kind of value list that needs to be
		//       turned into an expression?
		if (/(.+=.+,)*.+=.+/.test(attributeValue)) {
			attributeValue.split(',').forEach(attribute => {
				let [name, value] = attribute.split('=');
				let processorResult = context.expressionProcessor.process(value, context);
				element.setAttribute(name, escapeHtml(
					typeof processorResult === 'string' ?
						processorResult :
						JSON.stringify(processorResult))
				);
			});
		}
		/* istanbul ignore next */
		else if (process.env.NODE_ENV !== 'test') {
			console.warn(`Value to ${attribute}, ${attributeValue}, doesn't seem to contain an attribute assignment expression.  Ignoring.`);
		}
		return super.process(element, attribute, attributeValue, context);
	}
}
