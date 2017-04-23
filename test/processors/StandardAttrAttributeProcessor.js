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
'use strict';

const StandardAttrAttributeProcessor = require('../../src/standard/processors/StandardAttrAttributeProcessor');

const {assert} = require('chai');
const h        = require('hyperscript');
const hh       = require('hyperscript-helpers');

const {div} = hh(h);

/**
 * Tests for the `th:attr` attribute processor.
 */
describe('processors/StandardAttrAttributeProcessor', function() {

	let processor;
	beforeEach(function() {
		processor = new StandardAttrAttributeProcessor();
	});

	it('Set the value of the target attribute', function() {
		let value = 'test-class';
		let attributeName = 'th:attr';
		let attributeValue = 'class=${value}';
		let element = div();
		element.setAttribute(attributeName, attributeValue);

		processor.process(element, attributeName, attributeValue, { value });

		assert.isTrue(element.classList.contains(value));
	});

	it('Set multiple attributes', function() {
		let valueId = 'test-id';
		let valueClass = 'test-class';
		let attributeName = 'th:attr';
		let attributeValue = `id=\${valueId},class=${valueClass}`;
		let element = div();
		element.setAttribute(attributeName, attributeValue);

		processor.process(element, attributeName, attributeValue, { valueId });

		assert.strictEqual(element.id, valueId);
		assert.isTrue(element.classList.contains(valueClass));
	});
});
