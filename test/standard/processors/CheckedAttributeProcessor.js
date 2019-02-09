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

import CheckedAttributeProcessor       from '../../../source/standard/processors/CheckedAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../source/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the `th:checked` attribute processor.
 */
describe('processors/standard/CheckedAttributeProcessor', function() {

	let processor;
	let attribute;
	beforeAll(function() {
		processor = new CheckedAttributeProcessor('test');
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test('Sets the `checked` attribute if the expression is a truthy value', function() {
		let context = {
			greeting: 'Hello!'
		};
		['checked', '${greeting}'].forEach(value => {
			let element = createThymeleafAttributeValue(div(), attribute, value);
			processor.process(element, attribute, value, context);
			expect(element.hasAttribute('checked')).toBe(true);
		});
	});

	test('Removes the `checked` attribute if the expression is a falsey value', function() {
		let context = {
			greeting: null
		};
		['', '${greeting}'].forEach(value => {
			let element = createThymeleafAttributeValue(div(), attribute, value);
			processor.process(element, attribute, value, context);
			expect(element.hasAttribute('checked')).toBe(false);
		});
	});

});
