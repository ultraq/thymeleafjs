/* 
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import StandardEmptyableAttributeProcessor from '../../../src/standard/processors/StandardEmptyableAttributeProcessor';
import {createThymeleafAttributeValue}     from '../../../src/utilities/Dom';

import h  from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the configurable emptyable attribute processor.
 */
describe('processors/standard/StandardEmptyableAttributeProcessor', function() {

	const context = {
		greeting: 'Hello!'
	};
	const attributeNames = ['href', 'value'];

	test('Replaces the configured value', function() {
		attributeNames.forEach(attributeName => {
			let processor = new StandardEmptyableAttributeProcessor('test', attributeName);
			let attribute = `test:${attributeName}`;
			let attributeValue = '${greeting}';
			let element = createThymeleafAttributeValue(
				div({ [attributeName]: 'to-be-replaced' }),
				attribute,
				attributeValue
			);
			processor.process(element, attribute, attributeValue, context);
			expect(element.getAttribute(attributeName)).toBe(context.greeting);
		});
	});

	test('Empties the configured value', function() {
		attributeNames.forEach(attributeName => {
			let processor = new StandardEmptyableAttributeProcessor('test', attributeName);
			let attribute = `test:${attributeName}`;
			let attributeValue = '${nothing}';
			let element = createThymeleafAttributeValue(
				div({ [attributeName]: 'to-be-replaced' }),
				attribute,
				attributeValue
			);
			processor.process(element, attribute, attributeValue, context);
			expect(element.getAttribute(attributeName)).toBe('');
		});
	});

});
