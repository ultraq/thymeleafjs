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
 */
export default class Matcher {

	/**
	 * Create a matcher to work with the current context and isomorphic processing
	 * settings.
	 * 
	 * @param {Object} context
	 * @param {Object} isomorphic
	 */
	constructor(context, isomorphic) {

		this.context    = context;
		this.isomorphic = isomorphic;
	}

	/**
	 * Return the matching attribute or element that a processor can work over.
	 * 
	 * @param {Element} element
	 * @param {AttributeProcessor} processor
	 * @return {Object}
	 *   A match result containing a `match` key whose value is what was matched
	 *   (will be `null` if no match was made), and whether it was against the
	 *   isomorphic prefix or not.
	 */
	matches(element, processor) {

		let {name} = processor;

		// TODO: Some way to do this generically and not have to type check?

		// Attribute processor matching, can be of the name prefix:name or data-prefix-name
		if (processor instanceof AttributeProcessor) {
			let prefixes = [].concat(
				this.isomorphic?.prefix || [],
				processor.prefix
			);
			for (let prefix of prefixes) {
				let attribute;
				attribute = `${prefix}:${name}`;
				if (element.hasAttribute(attribute)) {
					return {
						match: attribute,
						isomorphic: prefix === this.isomorphic?.prefix
					};
				}
				attribute = `data-${prefix}-${name}`;
				if (element.hasAttribute(attribute)) {
					return {
						match: attribute,
						isomorphic: prefix === this.isomorphic?.prefix
					};
				}
			}
		}

		// Element processor, can only be of the name prefix:name
		else if (processor instanceof ElementProcessor) {
			let elementName = `${processor.prefix}:${name}`;
			if (element.tagName === elementName.toUpperCase()) {
				return {
					match: elementName,
					isomorphic: false
				};
			}
		}

		return {
			match: null
		};
	}
}
