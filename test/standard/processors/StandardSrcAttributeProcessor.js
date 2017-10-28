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

import StandardSrcAttributeProcessor   from '../../../src/standard/processors/StandardSrcAttributeProcessor';
import {createThymeleafAttributeValue} from '../../../src/utilities/Dom';

import {assert} from 'chai';
import h        from 'hyperscript';
import hh       from 'hyperscript-helpers';

const {a} = hh(h);

/**
 * Tests for the `th:src` attribute processor.
 */
describe('processors/standard/StandardSrcAttributeProcessor', function() {

	let processor;
	let attribute;
	before(function() {
		processor = new StandardSrcAttributeProcessor('test');
		attribute = `${processor.name}:${processor.prefix}`;
	});

	it("Replaces an element's `src` attribute", function() {
		let url = '/test';
		let attributeValue = `@{${url}}`;
		let element = createThymeleafAttributeValue(a({ src: '/to-be-replaced' }), attribute, attributeValue);

		processor.process(element, attribute, attributeValue);

		assert.strictEqual(element.src, url);
	});
});
