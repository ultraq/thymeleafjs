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

/**
 * Compares serialized DOMs for equality by stripping out certain whitespace
 * characters and seeing what remains.
 * 
 * @param {String} document1
 * @param {String} document2
 * @return {Boolean} `true` if both documents represent the same DOM structure.
 */
function areSerializedDocumentsEqual(document1, document2) {

	let document1Stripped = replaceWhitespace(document1);
	let document2Stripped = replaceWhitespace(document2);

	return document1Stripped === document2Stripped;
}

function replaceWhitespace(string) {
	return string.replace(/(\t|\n)/g, '');
}

exports.areSerializedDocumentsEqual = areSerializedDocumentsEqual;

/**
 * Returns the value of a Thymeleaf attribute processor.  Checks for both the
 * XML and data attribute variants.
 * 
 * @param {Element} element
 * @param {String} prefix
 * @param {String} name
 * @return {String} Value of a matching Thymeleaf attribute, or `null` if no
 *   attribute with that prefix and name exists.
 */
function getThymeleafAttributeValue(element, prefix, name) {

	return element[`${prefix}:${name}`] || element[`data-${prefix}-${name}`];
}

// Copied from thymeleaf-layout-dialect-js.  Publish as module?
exports .getThymeleafAttributeValue = getThymeleafAttributeValue;
