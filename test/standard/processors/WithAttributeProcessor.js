/* 
 * Copyright 2019, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import WithAttributeProcessor          from '../../../source/standard/processors/WithAttributeProcessor.js';
import {createThymeleafAttributeValue} from '../../../source/utilities/Dom.js';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the `th:with` attribute processor.
 */
describe('processors/standard/WithAttributeProcessor', function() {

	let attribute, processor;
	beforeAll(function() {
		processor = new WithAttributeProcessor('test');
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test('Returns the name and value of the expression', function() {
		let context = {
			someValue: 'Hello!'
		};
		let attributeValue = 'someKey=${someValue}';
		let element = createThymeleafAttributeValue(div(), attribute, attributeValue);

		processor.process(element, attribute, attributeValue, context);

		let localVariables = element.__thymeleafLocalVariables;
		expect(localVariables).toEqual(expect.objectContaining({
			'someKey': context.someValue
		}));
	});
});
