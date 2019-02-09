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

import FragmentAttributeProcessor      from '../../../source/standard/processors/FragmentAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../source/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

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

	test('Adds encountered fragments to the context (no fragments list)', function() {
		let attributeValue = 'my-fragment';
		let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

		let context = {};
		processor.process(element, attribute, attributeValue, context);

		let {fragments} = context;
		expect(Array.isArray(fragments)).toBe(true);
		expect(fragments[0]).toEqual({
			name: attributeValue,
			element
		});
	});

	test('Adds encountered fragments to the context (existing fragments list)', function() {
		let attributeValue = 'my-fragment';
		let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

		let context = {
			fragments: []
		};
		processor.process(element, attribute, attributeValue, context);

		let {fragments} = context;
		expect(Array.isArray(fragments)).toBe(true);
		expect(fragments[0]).toEqual({
			name: attributeValue,
			element
		});
	});
});
