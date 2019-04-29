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
 * Common class for dialects.
 * 
 * @author Emanuel Rabina
 */
export default class Dialect {

	/**
	 * Constructor, sets this dialect's name and optional prefix.
	 * 
	 * @param {String} name
	 * @param {String} [prefix]
	 */
	constructor(name, prefix) {

		this.name   = name;
		this.prefix = prefix;
	}

	/**
	 * Return an object whose keys are the expression object names, the values the
	 * expression object available properties and methods.
	 * 
	 * @return {Object}
	 */
	get expressionObjects() {

		return null;
	}

	/**
	 * Return an array of processors.
	 * 
	 * @return {Array}
	 */
	get processors() {

		return null;
	}
}
