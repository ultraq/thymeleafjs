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

import AttributeProcessor from './AttributeProcessor.js';
import ElementProcessor   from './ElementProcessor.js';

/**
 * Class for determining if an element contains a processor on it.
 * 
 * @author Emanuel Rabina
 */
export default class Matcher {

	/**
	 * Return the matching attribute or element that a processor can work over.
	 * 
	 * @param {Element} element
	 * @param {AttributeProcessor} processor
	 * @return {String}
	 *   A match result containing what was matched (either an attribute or an
	 *   element, relevant to the processor being tested), or `null` if nothing
	 *   was matched.
	 */
	matches(element, processor) {

		let {isomorphic, name, prefix} = processor;

		// Attribute processor matching, can be of the name prefix:name or data-prefix-name
		if (processor instanceof AttributeProcessor) {
			let prefixes = [prefix];
			if (isomorphic) {
				prefixes.unshift(isomorphic.prefix);
			}
			for (let prefix of prefixes) {
				let attribute;
				attribute = `${prefix}:${name}`;
				if (element.hasAttribute(attribute)) {
					return attribute;
				}
				attribute = `data-${prefix}-${name}`;
				if (element.hasAttribute(attribute)) {
					return attribute;
				}
			}
		}

		// Element processor, can only be of the name prefix:name
		else if (processor instanceof ElementProcessor) {
			let elementName = `${processor.prefix}:${name}`;
			if (element.tagName === elementName.toUpperCase()) {
				return elementName;
			}
		}

		return null;
	}
}
