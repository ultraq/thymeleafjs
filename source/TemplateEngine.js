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

import {DEFAULT_CONFIGURATION}  from './Configurations.js';
import AttributeProcessor       from './processors/AttributeProcessor.js';
import ElementProcessor         from './processors/ElementProcessor.js';
import Matcher                  from './processors/Matcher.js';
import StandardDialect          from './standard/StandardDialect.js';
import {promisify}              from './utilities/Functions.js';
import {deserialize, serialize} from './utilities/Dom.js';

import {flatten} from '@ultraq/array-utils';

const XML_NAMESPACE_ATTRIBUTE = `xmlns:${StandardDialect.DEFAULT_PREFIX}`;

/**
 * A highly-configurable class responsible for processing the Thymeleaf
 * directives found in HTML documents and fragments.
 * 
 * @author Emanuel Rabina
 */
export default class TemplateEngine {

	/**
	 * Constructor, set up a new template engine instance.
	 * 
	 * @param {Object} config
	 */
	constructor({dialects, isomorphic, templateResolver} = DEFAULT_CONFIGURATION) {

		this.dialects         = dialects;
		this.isomorphic       = isomorphic;
		this.processors       = flatten(dialects.map(dialect => dialect.processors));
		this.templateResolver = templateResolver;
	}

	/**
	 * Process the Thymeleaf template data, returning the processed template.
	 * 
	 * @param {String} template
	 * @param {Object} [context={}]
	 * @return {Promise<String>}
	 *   A promise resolved with the processed template, or rejected with an error
	 *   message.
	 */
	process(template, context = {}) {

		let document = deserialize(template);
		let rootElement = document.firstElementChild;
		return this.processNode(rootElement, {
			...context,
			dialects:         this.dialects,
			templateResolver: this.templateResolver
		})
			.then(() => {
				// TODO: Special case, remove the xmlns:th namespace from the document.
				//       This should be handled like in main Thymeleaf where it's just
				//       another processor that runs on the document.
				if (rootElement.hasAttribute(XML_NAMESPACE_ATTRIBUTE)) {
					rootElement.removeAttribute(XML_NAMESPACE_ATTRIBUTE);
				}
				return serialize(document);
			});
	}

	/**
	 * Process the Thymeleaf template at the given path, returning a promise of the
	 * processed template.
	 * 
	 * @param {String} filePath
	 * @param {Object} [context={}]
	 * @return {Promise<String>}
	 *   A promise resolved with the processed template, or rejected with an error
	 *   message.
	 */
	processFile(filePath, context = {}) {

		/* global ENVIRONMENT */
		return ENVIRONMENT === 'browser' ?
			Promise.reject(new Error('Cannot use fs.readFile inside a browser')) :
			promisify(require('fs').readFile)(filePath)
				.then(data => {
					return this.process(data, context);
				});
	}

	/**
	 * Process a DOM element.
	 * 
	 * @private
	 * @param {Element} element
	 * @param {Object} [context={}]
	 * @return {Promise<Boolean>} Whether or not the parent node needs
	 *   reprocessing.
	 */
	async processNode(element, context = {}) {

		let localVariables = element.__thymeleafLocalVariables || {};
		let localContext = {
			...context,
			...localVariables
		};
		let matcher = new Matcher(localContext, this.isomorphic);

		// Process the current element, store whether or not reprocessing of the
		// parent needs to happen before moving on to this element's children.
		for (let processor of this.processors) {
			let processorResult = false;

			// TODO: Some way to do this generically and not have to type check?
			let attributeOrElementName = matcher.matches(element, processor);
			if (attributeOrElementName) {
				if (processor instanceof AttributeProcessor) {
					processorResult = await processor.process(element, attributeOrElementName,
						element.getAttribute(attributeOrElementName), localContext);
				}
				else if (processor instanceof ElementProcessor) {
					processorResult = await processor.process(element, localContext);
				}
			}

			if (processorResult) {
				return true;
			}
		}

		// Process this element's children
		// TODO: This reprocessing mechanism causes double-handling of elements, eg:
		//       child n sends the reprocessing signal, then children 1...n-1 are
		//       all reprocessed.  This needs to be addressed for performance
		//       reasons.
		let reprocess;
		do {
			reprocess = false;
			for (let child of element.children) {
				reprocess = await this.processNode(child, localContext);
				if (reprocess) {
					break;
				}
			}
		}
		while (reprocess);
	}
}
