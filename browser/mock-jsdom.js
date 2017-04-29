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

// TODO: This doesn't feel so clean, to have the code assume JSDOM but then on
//       the browser bundle we redirect here.  Maybe create some "serializer"
//       that switches based on target build?

/**
 * Uses the browser's native DOM parsing instead of JSDOM.
 * 
 * @param {String} templateAsString
 * @return {DocumentFragment}
 */
export function jsdom(templateAsString) {
	return document.createRange().createContextualFragment(templateAsString);
}

/**
 * Use the browser's native DOM serialization instead of JSDOM.
 * 
 * @param {DocumentFragment} documentFragment
 * @return {String}
 */
export function serializeDocument(documentFragment) {
	return new XMLSerializer().serializeToString(documentFragment);
}
