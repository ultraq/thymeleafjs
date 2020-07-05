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

/**
 * Common class for attribute processors.
 * 
 * @author Emanuel Rabina
 */
export default class AttributeProcessor {

	/**
	 * Constructor, sets this processor's prefix and name.
	 * 
	 * @param {String} prefix
	 * @param {String} name
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, name, isomorphic) {

		this.prefix     = prefix;
		this.name       = name;
		this.isomorphic = isomorphic;
	}

	/**
	 * Process the given attribute on the element it appears.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Boolean} Whether or not the parent tree needs reprocessing because
	 *   of modifications made by the processor.
	 */
	process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);
		if (this.isomorphic) {
			element.removeAttribute(`${this.prefix}:${this.name}`);
		}
		return false;
	}
}
