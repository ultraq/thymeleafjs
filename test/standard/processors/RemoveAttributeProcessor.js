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

import RemoveAttributeProcessor from '../../../source/standard/processors/RemoveAttributeProcessor.js';
import {createHtml}             from '../../../source/utilities/Dom.js';

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
		let parent = createHtml(`
			<div id="parent">
				<div ${attribute}="${removeValue}"></div>
			</div>
		`);
		processor.process(parent.firstElementChild, attribute, removeValue);
		expect(parent.childElementCount).toBe(0);
	});

	test('Remove all-but-first', function() {
		let removeValue = 'all-but-first';
		let parent = createHtml(`
			<div ${attribute}="${removeValue}">
				<div id="first"></div>
				<div id="last"></div>
			</div>
		`);
		processor.process(parent, attribute, removeValue);
		expect(parent.childElementCount).toBe(1);
		expect(parent.firstElementChild).toBe(parent.querySelector('#first'));
	});
});
