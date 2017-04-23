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

const StandardIfAttributeProcessor = require('../../lib/standard/processors/StandardIfAttributeProcessor');
const {getThymeleafAttributeValue} = require('../../lib/utilities/Dom');

const {assert} = require('chai');
const h        = require('hyperscript');
const hh       = require('hyperscript-helpers');

const {div, p} = hh(h);

/**
 * Tests for the `th:if` attribute processor.
 */
describe('processors/StandardIfAttributeProcessor', function() {

	let processor;
	beforeEach(function() {
		processor = new StandardIfAttributeProcessor();
	});

	it('Renders the element and children if the expression is truthy', function() {
		let childElement = p({ 'th:if': '${value}' }, 'Hello!');
		let element = div([
			childElement
		]);
		let attributeValue = getThymeleafAttributeValue(childElement, processor.prefix, processor.name);
		processor.process(childElement, 'th:if', attributeValue, {
			value: true
		});
		assert.strictEqual(element.childNodes.length, 1);
	});

	it('Removes the element and children if the expression is falsey', function() {
		let childElement = p({ 'th:if': '${value}' }, 'Hello!');
		let element = div([
			childElement
		]);
		let attributeValue = getThymeleafAttributeValue(childElement, processor.prefix, processor.name);
		processor.process(childElement, 'th:if', attributeValue, {
			value: false
		});
		assert.strictEqual(element.childNodes.length, 0);
	});
});
