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
 * TODO: Do we even need a class for processors?  So far they all seem to be
 *       functions that execute based on a name match, which for all intents can
 *       be as simple as an object name/function pair!
 * 
 * @author Emanuel Rabina
 */
export default class AttributeProcessor {

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
}
