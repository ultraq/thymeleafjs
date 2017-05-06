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

import StandardIfAttributeProcessor    from '../../src/standard/processors/StandardIfAttributeProcessor';
import {createThymeleafAttributeValue} from '../../src/utilities/Dom';

import {assert} from 'chai';
import h        from 'hyperscript';
import hh       from 'hyperscript-helpers';

const {div, p} = hh(h);

/**
 * Tests for the `th:if` attribute processor.
 */
describe('processors/StandardIfAttributeProcessor', function() {

	let attribute, processor;
	before(function() {
		processor = new StandardIfAttributeProcessor('test');
		attribute = `${processor.name}:${processor.prefix}`;
	});

	it('Renders the element and children if the expression is truthy', function() {
		let expression = '${value}';
		let child = createThymeleafAttributeValue(p('Hello!'), attribute, expression);
		let parent = div([
			child
		]);
		processor.process(child, attribute, expression, { value: true });
		assert.strictEqual(parent.childNodes.length, 1);
	});

	it('Removes the element and children if the expression is falsey', function() {
		let expression = '${value}';
		let childElement = createThymeleafAttributeValue(p('Hello!'), attribute, expression);
		let element = div([
			childElement
		]);
		processor.process(childElement, 'th:if', expression, { value: false });
		assert.strictEqual(element.childNodes.length, 0);
	});
});
