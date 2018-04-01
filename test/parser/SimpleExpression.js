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

import InputBuffer from '../../src/parser/InputBuffer';
import SimpleExpression from '../../src/parser/SimpleExpression';

/**
 * Tests for the simple expression type.
 */
describe('parser/SimpleExpression', function() {

	let simpleExpression;
	beforeEach(function() {
		simpleExpression = new SimpleExpression(/[a-z]+/);
	});

	test('Returns the matched input for a successful parse', function() {
		let result = simpleExpression.parse({
			input: new InputBuffer('abc123')
		});
		expect(result).toBe('abc');
	});

	test('Returns `null` for a failed parse', function() {
		let result = simpleExpression.parse({
			input: new InputBuffer('123')
		});
		expect(result).toBeNull();
	});
});
