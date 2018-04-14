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

import InputBuffer             from '../../src/parser/InputBuffer';
import OrderedChoiceExpression from '../../src/parser/OrderedChoiceExpression';
import Parser                  from '../../src/parser/Parser';

/**
 * Tests for ordered choice expressions in a grammar.
 */
describe('parser/OrderedChoiceExpression', function() {

	let orderedChoiceExpression;
	beforeEach(function() {
		orderedChoiceExpression = new OrderedChoiceExpression([/abc/, /123/]);
	});

	test('A successful parse is one where any of the choices is successful', function() {
		let result = orderedChoiceExpression.match(new InputBuffer('abc'), new Parser());
		expect(result).toBe('abc');

		result = orderedChoiceExpression.match(new InputBuffer('123'), new Parser());
		expect(result).toBe('123');
	});

	test('A failed parse is one where none of the choices are successful', function() {
		let result = orderedChoiceExpression.match(new InputBuffer('xyz'), new Parser());
		expect(result).toBeNull();
	});

	test('Choices must be run through in order they are declared', function() {
		let input = new InputBuffer('123');
		let spy = jest.spyOn(input, 'read');
		let result = orderedChoiceExpression.match(input, new Parser());
		expect(result).toBe('123');
		expect(spy.mock.calls[0]).toEqual([/abc/]);
		expect(spy.mock.calls[1]).toEqual([/123/]);
	});
});
