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

import InputBuffer from '../../source/parser/InputBuffer';
import {
	OrderedChoice,
	Sequence,
	ZeroOrMore}      from '../../source/parser/Operators';
import Parser      from '../../source/parser/Parser';

/**
 * Tests for the expression composition operators.
 */
describe('parser/Operators', function() {

	describe('#OrderedChoice', function() {
		let orderedChoiceExpression = OrderedChoice(/abc/, /123/);

		test('A successful parse is one where any of the choices is successful', function() {
			let result = orderedChoiceExpression(new InputBuffer('abc'), new Parser());
			expect(result).toBe('abc');

			result = orderedChoiceExpression(new InputBuffer('123'), new Parser());
			expect(result).toBe('123');
		});

		test('A failed parse is one where none of the choices are successful', function() {
			let result = orderedChoiceExpression(new InputBuffer('xyz'), new Parser());
			expect(result).toBeNull();
		});

		test('Choices must be run through in order they are declared', function() {
			let input = new InputBuffer('123');
			let spy = jest.spyOn(input, 'read');
			let result = orderedChoiceExpression(input, new Parser());
			expect(result).toBe('123');
			expect(spy.mock.calls[0]).toEqual([/abc/]);
			expect(spy.mock.calls[1]).toEqual([/123/]);
		});
	});

	describe('#Sequence', function() {
		let sequenceExpression = Sequence(/abc/, /123/);

		test('A successful parse means all expressions in the sequence were successful', function() {
			let result = sequenceExpression(new InputBuffer('abc123'), new Parser());
			expect(result).toEqual(['abc', '123']);
		});

		test('A failed parse anywhere means the entire sequence has failed', function() {
			let result = sequenceExpression(new InputBuffer('abcdef'), new Parser());
			expect(result).toBeNull();

			result = sequenceExpression(new InputBuffer('xyz'), new Parser());
			expect(result).toBeNull();
		});

		test("If one expression fails, then don't carry on parsing", function() {
			let input = new InputBuffer('xyz123');
			let spy = jest.spyOn(input, 'read');
			let result = sequenceExpression(input, new Parser());
			expect(result).toBeNull();
			expect(spy).toHaveBeenCalledTimes(1);
		});
	});

	describe('#ZeroOrMore', function() {
		let zeroOrMoreExpression = ZeroOrMore(/abc/);

		test('A successful parse means no input, or the input repeating', function() {
			let result = zeroOrMoreExpression(new InputBuffer(''), new Parser());
			expect(result).toEqual([]);

			result = zeroOrMoreExpression(new InputBuffer('abcabc'), new Parser());
			expect(result).toEqual(['abc', 'abc']);
		});
	});

});
