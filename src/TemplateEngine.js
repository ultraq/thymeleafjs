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

import StandardDialect from './standard/StandardDialect';

import {jsdom, serializeDocument} from 'jsdom';
import {flatten}                  from 'lodash-es';

import fs from 'fs';

const DEFAULT_CONFIGURATION = {
	dialects: [
		new StandardDialect()
	]
};
const XML_NAMESPACE_ATTRIBUTE = 'xmlns:th';

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
	 * @param {Element} element
	 * @param {Object} context
	 */
	processNode(element, context) {

		// Process the current element
		this.processors.forEach(processor => {
			let attribute = `${processor.prefix}:${processor.name}`;
			if (!element.hasAttribute(attribute)) {
				attribute = `data-${processor.prefix}-${processor.name}`;
				if (!element.hasAttribute(attribute)) {
					return;
				}
			}
			let attributeValue = element.getAttribute(attribute);
			processor.process(element, attribute, attributeValue, context);
		});

		// Process this element's children
		Array.from(element.children).forEach(child => {
			this.processNode(child, context);
		});
	}

	/**
	 * Process the Thymeleaf template data, returning the processed template.
	 * 
	 * @param {String} template
	 * @param {Object} context
	 * @return {Promise}
	 *   Bluebird promise resolved with the processed template, or rejected with an
	 *   error message.
	 */
	process(template, context) {

		return new Promise((resolve, reject) => {
			try {
				let document = jsdom(template, {
					features: {
						FetchExternalResources: false,
						ProcessExternalResources: false
					}
				});

				let htmlElement = document.documentElement;
				this.processNode(htmlElement, context);

				// TODO: Special case, remove the xmlns:th namespace from the document.
				//       This should be handled like in main Thymeleaf where it's just
				//       another processor that runs on the document.
				if (htmlElement.hasAttribute(XML_NAMESPACE_ATTRIBUTE)) {
					htmlElement.removeAttribute(XML_NAMESPACE_ATTRIBUTE);
				}

				let documentAsString = serializeDocument(document);
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
	 * @param {Object} context
	 * @return {Promise}
	 *   Bluebird promise resolved with the processed template, or rejected with an
	 *   error message.
	 */
	processFile(filePath, context) {

		return new Promise((resolve, reject) => {
			fs.readFile(filePath, (error, data) => {
				if (error) {
					reject(error);
				}
				else {
					resolve(this.process(data, context));
				}
			});
		});
	}
}
