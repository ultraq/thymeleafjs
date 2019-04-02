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

import ExpressionProcessor from '../expressions/ExpressionProcessor.js';
import AttributeProcessor  from '../../processors/AttributeProcessor.js';

/**
 * `th:with`, used for creating scoped variables, useful for aliasing things.
 * 
 * @author Emanuel Rabina
 */
export default class WithAttributeProcessor extends AttributeProcessor {

	static NAME = 'with';

	/**
	 * Constructor, set this processor to use the `with` name and supplied
	 * prefix.
	 *
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, WithAttributeProcessor.NAME);
	}

	/**
	 * Processes an element that contains a `th:with`/`data-th-with` attribute,
	 * setting a variable scoped to the current element with the given name.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Promise<Boolean>} Whether or not the parent element needs to do a
	 *   second pass as its children have been modified by this processor.
	 */
	async process(element, attribute, attributeValue, context) {

		element.removeAttribute(attribute);

		// TODO: This is placing values in a data attribute much like how th:each
		//       currently works, but this is very inneficient as it requires
		//       re-processing of the node.  Really need to develop that "context
		//       stack" data structure for scoping values to elements more
		//       efficiently.
		let localVariables = {};
		let aliases = new ExpressionProcessor().process(attributeValue, context);
		aliases.forEach(({name, value}) => {
			localVariables[name] = value;
		});
		element.setAttribute('data-thymeleaf-local-variables', JSON.stringify(localVariables));

		return true;
	}
}
