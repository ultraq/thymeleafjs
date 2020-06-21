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

import FragmentAttributeProcessor from '../../../source/standard/processors/FragmentAttributeProcessor.js';
import {createHtml}               from '../../../source/utilities/Dom.js';

/**
 * Tests for the `th:fragment` attribute processor.
 */
describe('processors/standard/FragmentAttributeProcessor', function() {

	let processor;
	let attribute;
	beforeAll(function() {
		processor = new FragmentAttributeProcessor('test');
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test('Removes the attribute processor', function() {
		let attributeValue = 'my-fragment';
		let element = createHtml(`<div ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, {});
		expect(element.hasAttribute(attribute)).toBe(false);
	});
});
