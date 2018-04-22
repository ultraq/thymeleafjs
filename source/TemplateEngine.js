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

import {DEFAULT_CONFIGURATION}  from './Configurations';
import Matcher                  from './processors/Matcher';
import StandardDialect          from './standard/StandardDialect';
import {promisify}              from './utilities/Functions';
import {deserialize, serialize} from './utilities/Dom';

import {flatten} from '@ultraq/array-utils';
import {merge}   from '@ultraq/object-utils';

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
	 * @return {Promise<Boolean>} Whether or not the parent node needs reprocessing.
	 */
	async processNode(element, context = {}) {

		// TODO: Standardize this data attribute somewhere.  Shared const?
		// element.dataset not yet implemented in JSDOM (https://github.com/tmpvar/jsdom/issues/961),
		// so until then we're getting data- attributes the old-fashioned way.
		// Alternatively, some kind of variable stack that pops with each move up
		// the DOM.
		let localVariables = JSON.parse(element.getAttribute('data-thymeleaf-local-variables'));
		element.removeAttribute('data-thymeleaf-local-variables');
		let localContext = merge({}, context, localVariables);
		let matcher = new Matcher(context, this.isomorphic);

		// Process the current element, store whether or not reprocessing of the
		// parent needs to happen before moving on to this element's children.
		let requireReprocessing = false;
		for (let processor of this.processors) {
			let attribute = matcher.matches(element, processor);
			let processorResult = attribute ?
				await processor.process(element, attribute, element.getAttribute(attribute), localContext) :
				false;
			requireReprocessing = requireReprocessing || processorResult;
		}

		if (requireReprocessing) {
			return true;
		}

		// Process this element's children
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
