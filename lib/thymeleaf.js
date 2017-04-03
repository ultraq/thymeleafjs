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

const Promise     = require('bluebird');
const {DOMParser} = require('xmldom');

const fs = require('fs');

/**
 * Process the Thymeleaf template data, returning the processed template.
 * 
 * TODO: Return promise?
 * 
 * @param {String} template
 * @param {Object} context
 * @return {String}
 *   The processed Thymeleaf template.
 */
function process(template, context) {

	let document = new DOMParser().parseFromString(template, 'text/html');

	// TODO

	return document.toString();
}

exports.process = process;

/**
 * Process the Thymeleaf template at the given path, returning a promise of the
 * processed template.
 * 
 * @param {String} filePath
 * @param {Object} options
 * @return {Promise}
 *   Bluebird promise resolved with the processed template, or rejected with an
 *   error message.
 */
function processFile(filePath, options) {

	return new Promise(function(resolve, reject) {
		fs.readFile(filePath, function(error, data) {
			if (error) {
				reject(error);
			}
			resolve(process(data, options));
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
