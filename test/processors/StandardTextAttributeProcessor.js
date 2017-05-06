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

import StandardTextAttributeProcessor  from '../../src/standard/processors/StandardTextAttributeProcessor';
import {createThymeleafAttributeValue} from '../../src/utilities/Dom';

import {assert} from 'chai';
import h        from 'hyperscript';
import hh       from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the `th:text` attribute processor.
 */
describe('processors/StandardTextAttributeProcessor', function() {

	let attribute, processor;
	before(function() {
		processor = new StandardTextAttributeProcessor('test');
		attribute = `${processor.name}:${processor.prefix}`;
	});

	it("Replaces an element's text content", function() {
		let text = 'Hello!';
		let element = createThymeleafAttributeValue(div('Goodbye!'), attribute, text);
		processor.process(element, attribute, text);
		assert.strictEqual(element.textContent, text);
	});

	it('Escapes special HTML characters in the text content', function() {
		let text = '<script>';
		let element = createThymeleafAttributeValue(div('HTML stuffs'), attribute, text);
		processor.process(element, attribute, text);
		assert.strictEqual(element.textContent, '&lt;script&gt;');
	});
});
