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

import Expression from '../../src/parser/Expression';

/**
 * Tests for the expression helper methods.
 */
describe('parser/Expression', function() {

	let input;
	let expression;
	beforeEach(function() {
		input = {
			mark: jest.fn(),
			reset: jest.fn()
		};
		expression = new Expression();
	});

	describe('#markAndResetOnFailure', function() {

		test('Marks and returns for non-null results', function() {
			let result = expression.markAndResetOnFailure(input, jest.fn(() => 'Hello!'));
			expect(input.mark).toHaveBeenCalled();
			expect(result).not.toBeNull();
			expect(input.reset).not.toHaveBeenCalled();
		});

		test('Marks and resets for null results', function() {
			let result = expression.markAndResetOnFailure(input, jest.fn(() => null));
			expect(input.mark).toHaveBeenCalled();
			expect(result).toBeNull();
			expect(input.reset).toHaveBeenCalled();
		});

	});

	describe('#parseRegularExpressionOrString', function() {

		test('Looks up rules if expression is a string', function() {
			let grammar = {
				findRuleByName: jest.fn(() => ({
					parse: jest.fn(() => 'Hello!')
				}))
			};
			let result = expression.parseRegularExpressionOrString({ grammar, input }, 'SomeRule');
			expect(grammar.findRuleByName).toHaveBeenCalledWith('SomeRule');
			expect(result).toBe('Hello!');
		});

		test('Attempts to read input if expression is a regexp', function() {
			let inputWithRead = {
				...input,
				read: jest.fn(() => 'Hello')
			};
			let result = expression.parseRegularExpressionOrString({ input: inputWithRead }, /Hello/);
			expect(inputWithRead.read).toHaveBeenCalledWith(/Hello/);
			expect(result).toBe('Hello');
		});
	});

});
