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

import {
	createThymeleafAttributeValue,
	getThymeleafAttributeValue
} from '../../source/utilities/Dom.js';

import h from 'hyperscript';
import hh from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the DOM utilities.
 */
describe('utilities/Dom', function() {

	describe('#getThymeleafAttributeValue', function() {
		const prefix = 'thjs';
		const name = 'test';
		const value = 'hello';

		test('Returns the XML attribute value', function() {
			let element = createThymeleafAttributeValue(div(), `${prefix}:${name}`, value);
			let result = getThymeleafAttributeValue(element, prefix, name);
			expect(result).toBe(value);
		});

		test('Returns the data- attribute value', function() {
			let element = createThymeleafAttributeValue(div(), `data-${prefix}-${name}`, value);
			let result = getThymeleafAttributeValue(element, prefix, name);
			expect(result).toBe(value);
		});
	});
});
