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

/* global ENVIRONMENT */

/**
 * Create and return a new HTML fragment using JSDOM from the given string.
 * Used for tests.
 * 
 * @param {String} htmlString
 * @return {Element}
 */
export function createHtml(htmlString) {
	const {JSDOM} = require('jsdom');
	return new JSDOM(htmlString).window.document.body.firstElementChild;
}

/**
 * Returns the value of a Thymeleaf attribute processor.
 * 
 * @param {Element} element
 * @param {String} prefix
 * @param {String} processorName
 * @return {String} The value of the Thymeleaf attribute processor, or `null`
 *   if the attribute processor wasn't present.
 */
export function getThymeleafAttributeValue(element, prefix, processorName) {
	return element.getAttribute(`${prefix}:${processorName}`) ||
	       element.getAttribute(`data-${prefix}-${processorName}`);
}

/**
 * Use either JSDOM or the browser's native DOM parsing to deserialize the HTML
 * string into a document fragment.
 * 
 * @param {String} htmlString
 * @return {DocumentFragment}
 */
export function deserialize(htmlString) {
	/* istanbul ignore if */
	if (ENVIRONMENT === 'browser') {
		return require('@ultraq/dom-utils').deserialize(htmlString);
	}
	else {
		const {JSDOM} = require('jsdom');
		return new JSDOM(htmlString).window.document;
	}
}

/**
 * Use either JSDOM or the browser's native DOM serialization to serialize a
 * document fragment into an HTML string.
 * 
 * @param {DocumentFragment} documentFragment
 * @return {String}
 */
export function serialize(documentFragment) {
	/* istanbul ignore if */
	if (ENVIRONMENT === 'browser') {
		return require('@ultraq/dom-utils').serialize(documentFragment);
	}
	else {
		let result = '';
		let {firstChild, firstElementChild} = documentFragment;
		if (firstChild.nodeType === Node.DOCUMENT_TYPE_NODE) {
			result += `<!DOCTYPE ${firstChild.name}>`;
		}
		return result + firstElementChild.outerHTML;
	}
}
