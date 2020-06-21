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

import BlockElementProcessor from '../../../source/standard/processors/BlockElementProcessor.js';
import {createHtml}          from '../../../source/utilities/Dom.js';

/**
 * Tests for the block element processor.
 */
describe('standard/processors/BlockElementProcessor', function() {

	let processor;
	let elementName;
	beforeAll(function() {
		processor = new BlockElementProcessor('test');
		elementName = `${processor.prefix}:${processor.name}`;
	});

	test('Scoped values copied down to child elements ', function() {
		let container = createHtml(`
			<div>
				<${elementName}>
					<p>Hello!</p>
				</${elementName}>
			</div>
		`);
		let element = container.firstElementChild;
		element.__thymeleafLocalVariables = {};
		processor.process(element, {});
		expect(container.querySelector('p')).toHaveProperty('__thymeleafLocalVariables', element.__thymeleafLocalVariables);
	});
});
