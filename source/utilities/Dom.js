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
 * Removes all of an element's child nodes.
 * 
 * @param {Element} element
 */
export function clearChildren(element) {
	while (element.firstChild) {
		element.removeChild(element.firstChild);
	}
}

/**
 * Sets a Thymeleaf attribute and value on an existing element.  Used primarily
 * in tests.
 * 
 * @param {Element} element
 * @param {String} attribute
 * @param {String} value
 * @return {Element} The same element but with the attribute and value set on it.
 */
export function createThymeleafAttributeValue(element, attribute, value) {
	element.setAttribute(attribute, value);
	return element;
}

/**
 * Use either JSDOM or the browser's native DOM parsing to deserialize the HTML
 * string into a document fragment.
 * 
 * @param {String} htmlString
 * @return {DocumentFragment}
 */
export function deserialize(htmlString) {
	return ENVIRONMENT === 'browser' ?
		/* istanbul ignore next */
		document.createRange().createContextualFragment(htmlString) :
		require('jsdom').jsdom(htmlString, {
			features: {
				FetchExternalResources: false,
				ProcessExternalResources: false
			}
		});
}

/**
 * Use either JSDOM or the browser's native DOM serialization to serialize a
 * document fragment into an HTML string.
 * 
 * @param {DocumentFragment} documentFragment
 * @return {String}
 */
export function serialize(documentFragment) {
	return ENVIRONMENT === 'browser' ?
		/* istanbul ignore next */
		new XMLSerializer().serializeToString(documentFragment) :
		require('jsdom').serializeDocument(documentFragment);
}
