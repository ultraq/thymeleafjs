/* 
 * Copyright 2019, Emanuel Rabina (http://www.ultraq.net.nz/)
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
 * Parent class for element processors.
 * 
 * @author Emanuel Rabina
 */
export default class ElementProcessor {

	/**
	 * Constructor, sets this processor's prefix and name.
	 * 
	 * @param {String} prefix
	 * @param {String} name
	 */
	constructor(prefix, name) {

		this.prefix = prefix;
		this.name   = name;
	}

	/**
	 * Processes the given element.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {Object} context
	 * @return {Boolean} Whether or not the parent tree needs reprocessing because
	 *   of modifications made by the processor.
	 */
	process(element, context) {

		return false;
	}
}
