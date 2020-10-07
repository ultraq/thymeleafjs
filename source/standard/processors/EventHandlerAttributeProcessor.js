/* 
 * Copyright 2020, Emanuel Rabina (http://www.ultraq.net.nz/)
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
 * Configurable attribute processor for working with all on* attributes, those
 * that are used for event handling.
 * 
 * @author Emanuel Rabina
 */
export default class EventHandlerAttributeProcessor extends AttributeProcessor {

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
	 * Processes an element that contains the configured event handling attribute,
	 * effectively attaching the event handler referenced to the element.
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

		let eventName = this.name.substring(2);
		let eventHandler = context.expressionProcessor.process(attributeValue, context);
		element.addEventListener(eventName, eventHandler);
		return super.process(element, attribute, attributeValue, context);
	}
}

export const EVENT_ATTRIBUTE_NAMES = [
	'onclick'
];
