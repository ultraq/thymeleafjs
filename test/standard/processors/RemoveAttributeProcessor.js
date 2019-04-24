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

import RemoveAttributeProcessor        from '../../../source/standard/processors/RemoveAttributeProcessor.js';
import {createThymeleafAttributeValue} from '../../../source/utilities/Dom.js';

import h from 'hyperscript';

/**
 * Tests for the attribute processor that removes certain elements.
 */
describe('processors/standard/RemoveAttributeProcessor', function() {

	let attribute, processor;
	beforeAll(function() {
		processor = new RemoveAttributeProcessor('test');
		attribute = `${processor.prefix}:${processor.name}`;
	});

	test('Remove all', function() {
		let removeValue = 'all';
		let element = createThymeleafAttributeValue(h('div'), attribute, removeValue);
		let parent = h('div#parent', [
			element
		]);
		processor.process(element, attribute, removeValue);
		expect(parent.childElementCount).toBe(0);
	});

	test('Remove all-but-first', function() {
		let removeValue = 'all-but-first';
		let first = h('div#first');
		let element = createThymeleafAttributeValue(h('div', [
			first,
			h('div#last')
		]), attribute, removeValue);
		processor.process(element, attribute, removeValue);
		expect(element.childElementCount).toBe(1);
		expect(element.lastElementChild).toBe(first);
	});
});
