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

import StandardEachAttributeProcessor  from '../../../src/standard/processors/StandardEachAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../src/utilities/Dom';

import {range} from '@ultraq/array-utils';
import h       from 'hyperscript';
import hh      from 'hyperscript-helpers';

const {ul, li} = hh(h);

/**
 * Tests for the `th:each` attribute processor.
 */
describe('processors/standard/StandardEachAttributeProcessor', function() {

	let processor, attribute;
	beforeAll(function() {
		processor = new StandardEachAttributeProcessor('test');
		attribute = `${processor.name}:${processor.prefix}`;
	});

	test('Repeats an element for every item in an iterable', function() {
		let iterationExpression = 'items: ${items}';
		let items = range(1, 10);
		let child = createThymeleafAttributeValue(li(), attribute, iterationExpression);
		let parent = ul([
			child
		]);
		let result = processor.process(child, attribute, iterationExpression, { items });

		expect(result).toBeTrue();
		expect(parent.childElementCount).toBe(9);
	});
});
