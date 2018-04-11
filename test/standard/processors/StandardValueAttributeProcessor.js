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

import StandardValueAttributeProcessor from '../../../src/standard/processors/StandardValueAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../src/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {input} = hh(h);

/**
 * Tests for the `th:value` attribute processor.
 */
describe('standard/processors/StandardValueAttributeProcessor', function() {

	let processor;
	let attribute;
	beforeAll(function() {
		processor = new StandardValueAttributeProcessor('test');
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test("Replaces an element's `value` attribute", function() {
		let attributeValue = 'Hello!';
		let element = createThymeleafAttributeValue(input({ value: '/to-be-replaced' }), attribute, attributeValue);

		processor.process(element, attribute, attributeValue);

		expect(element.value).toBe(attributeValue);
	});
});
