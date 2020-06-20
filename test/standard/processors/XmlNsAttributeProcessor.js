/* 
 * Copyright 2020, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import XmlNsAttributeProcessor from '../../../source/standard/processors/XmlNsAttributeProcessor.js';

import {JSDOM} from 'jsdom';

/**
 * Tests for the `xmlns:th` removal processor.
 */
describe('processors/standard/XmlNsAttributeProcessor', function() {

	const namespace = 'http://www.thymeleaf.org';
	let attribute, processor;
	beforeAll(function() {
		processor = new XmlNsAttributeProcessor('test');
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test('Removes the namespace attribute from an element', function() {
		let element = new JSDOM(`<html xmlns:test="${namespace}"></html>`).window.document.firstElementChild;
		let reprocess = processor.process(element, attribute, namespace, {});
		expect(reprocess).toBe(false);
		expect(element.hasAttribute(attribute)).toBe(false);
	});
});
