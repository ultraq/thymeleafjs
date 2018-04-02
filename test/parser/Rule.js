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

import Rule from '../../src/parser/Rule';

/**
 * Tests for the rule component of a grammar.
 */
describe('parser/Rule', function() {

	test('Gets its result from parsing the inner expression', function() {
		let rule = new Rule('Test', {
			parse: jest.fn(() => 'Hello!')
		});
		let result = rule.parse();
		expect(result).toBe('Hello!');
	});

	test('Result is based on the configured node converter', function() {
		let rule = new Rule('Test', {
			parse: jest.fn(() => 'Hello!')
		}, result => ({ result }));
		let result = rule.parse();
		expect(result).toEqual({ result: 'Hello!' });
	});

	test('A failed parse returns `null`', function() {
		let rule = new Rule('Test', {
			parse: jest.fn(() => null)
		});
		let result = rule.parse();
		expect(result).toBeNull();
	});
});
