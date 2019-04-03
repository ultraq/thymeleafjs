/* 
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import AttributeProcessor              from '../../source/processors/AttributeProcessor.js';
import ElementProcessor                from '../../source/processors/ElementProcessor.js';
import Matcher                         from '../../source/processors/Matcher';
import {createThymeleafAttributeValue} from '../../source/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the matcher class.
 */
describe('processors/Matcher', function() {

	const prefix = 'test';
	const name   = 'greeting';

	let matcher;
	beforeAll(function() {
		matcher = new Matcher({}, false);
	});

	describe('Attribute processor matching', function() {
		const mockProcessor = new AttributeProcessor(prefix, name);

		test('Match XML attributes', function() {
			let attribute = `${prefix}:${name}`;
			let element = createThymeleafAttributeValue(div(), attribute, 'hello');
			let match = matcher.matches(element, mockProcessor);
			expect(match).toBe(attribute);
		});

		test('Match data- attributes', function() {
			let attribute = `data-${prefix}-${name}`;
			let element = createThymeleafAttributeValue(div(), attribute, 'hello');
			let match = matcher.matches(element, mockProcessor);
			expect(match).toBe(attribute);
		});

		test('Return `null` if no match', function() {
			let element = createThymeleafAttributeValue(div(), 'test:something-else', 'hello');
			let match = matcher.matches(element, mockProcessor);
			expect(match).toBeNull();
		});
	});

	describe('Element processor matching', function() {
		const mockProcessor = new ElementProcessor(prefix, name);

		test('Match XML namespaced elements', function() {
			let elementName = `${prefix}:${name}`;
			let element = document.createElement(elementName);
			let match = matcher.matches(element, mockProcessor);
			expect(match).toBe(elementName);
		});
	});
});
