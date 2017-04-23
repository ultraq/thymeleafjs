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

const StandardTUextAttributeProcessor = require('../../src/standard/processors/StandardUTextAttributeProcessor');
const {getThymeleafAttributeValue}    = require('../../src/utilities/Dom');

const {assert} = require('chai');
const h        = require('hyperscript');
const hh       = require('hyperscript-helpers');

const {div} = hh(h);

/**
 * Tests for the `th:utext` attribute processor.
 */
describe('processors/StandardTextAttributeProcessor', function() {

	let processor;
	beforeEach(function() {
		processor = new StandardTUextAttributeProcessor();
	});

	it("Replaces an element's text content", function() {
		let text = 'Hello!';
		let element = div({ 'th:utext': text }, 'Goodbye');
		let attributeValue = getThymeleafAttributeValue(element, processor.prefix, processor.name);
		processor.process(element, 'th:text', attributeValue, {});
		assert.strictEqual(element.textContent, text);
	});

	it("Doesn't escape special HTML characters in the text content", function() {
		let text = '<script>';
		let element = div({ 'th:utext': text }, 'HTML stuffs');
		let attributeValue = getThymeleafAttributeValue(element, processor.prefix, processor.name);
		processor.process(element, 'th:text', attributeValue, {});
		assert.strictEqual(element.textContent, text);
	});
});
