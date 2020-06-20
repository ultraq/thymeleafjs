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

import FragmentAttributeProcessor     from './FragmentAttributeProcessor.js';
import StandardDialect                from '../StandardDialect.js';
import ExpressionProcessor            from '../expressions/ExpressionProcessor.js';
import FragmentSignatureGrammar       from '../expressions/FragmentSignatureGrammar.js';
import SelfRemovingAttributeProcessor from '../../processors/SelfRemovingAttributeProcessor.js';
import {getThymeleafAttributeValue}   from '../../utilities/Dom.js';
import {extractFragment}              from '../../utilities/Fragments.js';

import {clearChildren} from '@ultraq/dom-utils';

/**
 * JS equivalent of Thymeleaf's `th:relace` attribute processor, replaces the
 * current element with the fragment referenced by the processor.
 * 
 * @author Emanuel Rabina
 */
export default class ReplaceAttributeProcessor extends SelfRemovingAttributeProcessor {

	static NAME = 'replace';

	/**
	 * Constructor, set this processor to use the `replace` name and supplied
	 * prefix.
	 * 
	 * @param {String} prefix
	 * @param {Object} isomorphic
	 */
	constructor(prefix, isomorphic) {

		super(prefix, ReplaceAttributeProcessor.NAME, isomorphic);
	}

	/**
	 * Processes an element that contains a `th:replace`/`data-th-replace`
	 * attribute, replacing the current element with the DOM in the referenced
	 * fragment.
	 * 
	 * @param {Element} element
	 *   Element being processed.
	 * @param {String} attribute
	 *   The attribute that was encountered to invoke this processor.
	 * @param {String} attributeValue
	 *   The value given by the attribute.
	 * @param {Object} context
	 * @return {Boolean} Whether or not the parent element needs to do a second
	 *   pass as its children have been modified by this processor.
	 */
	async process(element, attribute, attributeValue, context) {

		super.process(element, attribute, attributeValue, context);
		clearChildren(element);

		let fragmentInfo = new ExpressionProcessor().process(attributeValue, context);
		if (fragmentInfo) {
			let fragment = await extractFragment(fragmentInfo, context);
			if (fragment) {

				let standardDialect = context.dialects.find(dialect => dialect.name === StandardDialect.NAME);
				let dialectPrefix = standardDialect.prefix;
				let fragmentProcessorName = FragmentAttributeProcessor.NAME;

				let fragmentSignature = getThymeleafAttributeValue(fragment, dialectPrefix, fragmentProcessorName);
				let {parameterNames} = new ExpressionProcessor(FragmentSignatureGrammar).process(fragmentSignature, context);
				if (parameterNames) {
					let {parameters} = fragmentInfo;

					let localContext = {};
					parameterNames.forEach((parameterName, index) => {
						localContext[parameterName] = parameters[parameterName] || parameters[index] || null;
					});

					fragment.__thymeleafLocalVariables = localContext;
				}

				// TODO: Can simplify this with insertAdjacent*(), but need to upgrade
				//       JSDOM first.
				element.parentElement.insertBefore(fragment, element);
				element.remove();
				return true;
			}
		}

		element.remove();
		return false;
	}
}
