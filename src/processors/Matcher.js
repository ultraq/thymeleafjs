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
	 * Return the matching attribute of an element that a processor can work over.
	 * 
	 * @param {Element} element
	 * @param {AttributeProcessor} processor
	 * @return {String}
	 *   The attribute that matched processing by this processor, or `null` if no
	 *   match was found.
	 */
	matches(element, processor) {

		let prefixes = [].concat(
			this.isomorphic ? this.isomorphic.prefix : [],
			processor.prefix
		);
		let {name} = processor;

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
		return null;
	}
}
