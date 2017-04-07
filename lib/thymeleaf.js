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
'use strict';

const StandardTextAttributeProcessor = require('./processors/StandardTextAttributeProcessor');
const {getThymeleafAttributeValue}   = require('./utilities/Dom');

const Promise                    = require('bluebird');
const {jsdom, serializeDocument} = require('jsdom');

const fs = require('fs');

// List of supported attribute processors, limits what we can do but lets me
// impose basic ordering as per the behaviour in main Thymeleaf.
const ATTRIBUTE_PROCESSORS = [
	StandardTextAttributeProcessor
];

/**
 * Process a DOM element.
 * 
 * @param {Element} element
 * @param {Object} context
 */
function processNode(element, context) {

	// Process the current element
	ATTRIBUTE_PROCESSORS.forEach(attributeProcessor => {
		let attribute = getThymeleafAttributeValue(element, attributeProcessor.prefix, attributeProcessor.name);
		if (attribute) {
			attributeProcessor.process(element, attribute, context);
		}
	});

	// Process this element's children
	element.children.forEach(child => {
		processNode(child, context);
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
function process(template, context) {

	return new Promise((resolve, reject) => {
		try {
			let document = jsdom(template, {
				features: {
					FetchExternalResources: false,
					ProcessExternalResources: false
				}
			});

			processNode(document.documentElement, context);

			let documentAsString = serializeDocument(document);
			resolve(documentAsString);
		}
		catch (exception) {
			reject(exception);
		}
	});
}

exports.process = process;

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
function processFile(filePath, context) {

	return new Promise(function(resolve, reject) {
		fs.readFile(filePath, function(error, data) {
			if (error) {
				reject(error);
			}
			else {
				resolve(process(data, context));
			}
		});
	});
}

exports.processFile = processFile;

/**
 * Export for integration w/ Express.
 * 
 * @param {String} filePath
 * @param {Object} options
 * @param {Function} callback
 */
exports.__express = function(filePath, options, callback) {

	processFile(filePath, options).then(callback);
};
