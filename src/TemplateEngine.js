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
import StandardDialect          from './standard/StandardDialect';
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
	 * @param {Array} dialects
	 *   List of dialects to use in the new template engine.  Defaults to just the
	 *   standard dialect.
	 */
	constructor({ dialects } = DEFAULT_CONFIGURATION) {

		// Create the engine's instance of processors from all of the configured
		// dialect processors
		this.processors = flatten(dialects.map(dialect => dialect.processors));
	}

	/**
	 * Process a DOM element.
	 * 
	 * @private
	 * @param {Element} element
	 * @param {Object} [context={}]
	 * @return {Boolean} Whether or not the parent node needs reprocessing.
	 */
	processNode(element, context = {}) {

		// TODO: Standardize this data attribute somewhere.  Shared const?
		// element.dataset not yet implemented in JSDOM (https://github.com/tmpvar/jsdom/issues/961),
		// so until then we're getting data- attributes the old-fashioned way.
		let localVariables = JSON.parse(element.getAttribute('data-thymeleaf-local-variables'));
		element.removeAttribute('data-thymeleaf-local-variables');
		let localContext = merge({}, context, localVariables);

		// Process the current element, store whether or not reprocessing of the
		// parent needs to happen before moving on to this element's children.
		let requireReprocessing = this.processors
			.map(processor => {
				let attribute = processor.matches(element);
				return attribute ?
					processor.process(element, attribute, element.getAttribute(attribute), localContext) :
					false;
			})
			.reduce((accumulator, processorResult) => accumulator || processorResult, false);

		if (requireReprocessing) {
			return true;
		}

		// Process this element's children
		let reprocess;
		do {
			reprocess = false;
			for (let child of element.children) {
				reprocess = this.processNode(child, localContext);
				if (reprocess) {
					break;
				}
			}
		}
		while (reprocess);
	}

	/**
	 * Process the Thymeleaf template data, returning the processed template.
	 * 
	 * @param {String} template
	 * @param {Object} [context={}]
	 * @return {Promise}
	 *   A promise resolved with the processed template, or rejected with an error
	 *   message.
	 */
	process(template, context = {}) {

		return new Promise((resolve, reject) => {
			try {
				let document = deserialize(template);
				let rootElement = document.firstElementChild;
				this.processNode(rootElement, context);

				// TODO: Special case, remove the xmlns:th namespace from the document.
				//       This should be handled like in main Thymeleaf where it's just
				//       another processor that runs on the document.
				if (rootElement.hasAttribute(XML_NAMESPACE_ATTRIBUTE)) {
					rootElement.removeAttribute(XML_NAMESPACE_ATTRIBUTE);
				}

				let documentAsString = serialize(document);
				resolve(documentAsString);
			}
			catch (exception) {
				reject(exception);
			}
		});
	}

	/**
	 * Process the Thymeleaf template at the given path, returning a promise of the
	 * processed template.
	 * 
	 * @param {String} filePath
	 * @param {Object} [context={}]
	 * @return {Promise}
	 *   A promise resolved with the processed template, or rejected with an error
	 *   message.
	 */
	processFile(filePath, context = {}) {

		/* global ENVIRONMENT */
		return ENVIRONMENT === 'browser' ?
			Promise.reject('Cannot use fs.readFile inside a browser') :
			new Promise((resolve, reject) => {
				require('fs').readFile(filePath, (error, data) => {
					if (error) {
						reject(new Error(error));
					}
					else {
						resolve(this.process(data, context));
					}
				});
			});
	}
}
