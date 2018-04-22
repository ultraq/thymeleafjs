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

import FragmentAttributeProcessor from './FragmentAttributeProcessor';
import StandardDialect                    from '../StandardDialect';
import ExpressionProcessor                from '../expressions/ExpressionProcessor';
import AttributeProcessor                 from '../../processors/AttributeProcessor';
import {clearChildren, deserialize}       from '../../utilities/Dom';

import {$} from 'dumb-query-selector';

/**
 * JS equivalent of Thymeleaf's `th:insert` attribute processor, inserts the
 * referenced template fragment as a child of the current element.
 * 
 * @author Emanuel Rabina
 */
export default class InsertAttributeProcessor extends AttributeProcessor {

	static NAME = 'insert';

	/**
	 * Constructor, set this processor to use the `insert` name and supplied prefix.
	 * 
	 * @param {String} prefix
	 */
	constructor(prefix) {

		super(prefix, InsertAttributeProcessor.NAME);
	}

	/**
	 * Processes an element that contains a `th:insert`/`data-th-insert` attribute,
	 * replacing the current element's children with the DOM in the referenced
	 * fragment.
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
		clearChildren(element);

		let {templateResolver} = context;
		if (templateResolver) {
			let fragmentInfo = new ExpressionProcessor(context).process(attributeValue);
			if (fragmentInfo) {
				let {templateName, fragmentName} = fragmentInfo;
				let template = deserialize(await templateResolver(templateName));

				let standardDialect = context.dialects.find(dialect => dialect.name === StandardDialect.NAME);
				let dialectPrefix = standardDialect.prefix;
				let fragmentProcessorName = FragmentAttributeProcessor.NAME;
				let fragment =
					$(`[${dialectPrefix}\\:${fragmentProcessorName}^="${fragmentName}"]`, template) ||
					$(`[data-${dialectPrefix}-${fragmentProcessorName}^="${fragmentName}"`, template);

				element.appendChild(fragment);
				return true;
			}
		}
		else {
			console.log(`No template resolver configured, unable to locate fragment via ${attributeValue} processor`);
		}

		return false;
	}
}
