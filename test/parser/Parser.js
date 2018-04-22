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

import Grammar from '../../source/parser/Grammar';
import Parser  from '../../source/parser/Parser';
import Rule    from '../../source/parser/Rule';

/**
 * Tests for the main parser component.
 */
describe('parser/Parser', function() {

	let grammar;
	let parser;
	beforeEach(function() {
		grammar = new Grammar('Test',
			new Rule('StartingRule', /abc/),
			new Rule('NumberRule', /123/)
		);
		parser = new Parser(grammar);
	});

	describe('#parse', function() {

		test('Parsing successful when configured grammar returns nodes for all read input', function() {
			let result = parser.parse('abc');
			expect(result).toBe('abc');
		});

		test('Parsing fails if not all input was read', function() {
			expect(() => {
				parser.parse('abcd');
			}).toThrow();
		});
	});

	describe('#parseRegularExpressionOrString', function() {
		let input;
		beforeEach(function() {
			input = {
				clear: jest.fn(),
				mark: jest.fn(),
				read: jest.fn(),
				reset: jest.fn()
			};
		});

		test('Looks up rules if expression is a string', function() {
			let findSpy = jest.spyOn(grammar, 'findRuleByName');
			expect.assertions(1);
			try {
				parser.parseWithExpression(input, 'SomeRule');
			}
			catch (ex) {
				expect(findSpy).toHaveBeenCalledWith('SomeRule');
			}
		});

		test('Attempts to read input if expression is a regexp', function() {
			parser.parseWithExpression(input, /Hello/);
			expect(input.read).toHaveBeenCalledWith(/Hello/);
		});
	});

});
