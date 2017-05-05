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

import {processExpression, processIterationExpression} from '../../src/expressions/ExpressionProcessor';

import {assert} from 'chai';

/**
 * Tests for the expression processor.
 */
describe('expressions/ExpressionProcessor', function() {

	describe('Named context object expressions', function() {

		it('Value mapping', function() {
			let greeting = 'Hello!';
			let result = processExpression('${greeting}', { greeting });
			assert.strictEqual(result, greeting);
		});

		it('null/undefined value handling', function() {
			let result = processExpression('${greeting}', { greeting: null });
			assert.strictEqual(result, '');
		});

		it('No context handling', function() {
			let result = processExpression('${greeting}');
			assert.strictEqual(result, '');
		});
	});


	it('Verbatim expressions', function() {
		let greeting = 'Hello!';
		let result = processExpression(greeting);
		assert.strictEqual(result, greeting);
	});


	describe('Iteration expressions', function() {

		it('Value and local name mapping', function() {
			let items = ['a', 'b', 'c'];
			let expression = 'item: ${items}';
			let result = processIterationExpression(expression, { items });
			assert.strictEqual(result.localValueName, 'item');
			assert.strictEqual(result.iterable, items);
		});
	});
});
