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

import AttributeProcessor from '../../processors/AttributeProcessor.js';

export const NAME = 'with';

/**
 * `th:with`, used for creating scoped variables, useful for aliasing things.
 * 
 * @author Emanuel Rabina
 */
export default class WithAttributeProcessor extends AttributeProcessor {

	/**
	 * Constructor, set this processor to use the `with` name and supplied
	 * prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix, isomorphic) {

		super(prefix, NAME, isomorphic);
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
	 * @return {Boolean} `true` as adding new local variables needs to re-run
	 *   processing.
	 */
	process(element, attribute, attributeValue, context) {

		super.process(element, attribute, attributeValue, context);

		let localVariables = {};
		let aliases = context.expressionProcessor.process(attributeValue, context);
		aliases.forEach(({name, value}) => {
			localVariables[name] = value;
		});
		element.__thymeleafLocalVariables = localVariables;

		return true;
	}
}
