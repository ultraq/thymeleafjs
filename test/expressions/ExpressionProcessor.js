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

import {
	processExpression,
	processIterationExpression
} from '../../src/expressions/ExpressionProcessor';

/**
 * Tests for the expression processor.
 */
describe('expressions/ExpressionProcessor', function() {

	describe('Object navigation expressions', function() {

		const context = {
			greeting: 'Good morning!',
			greetings: {
				hello: 'Hello :)',
				goodbye: 'Goodbye :(',
				goodnight: null
			}
		};

		test('Expressions get passed to underlying function', function() {
			let result;

			result = processExpression('${greeting}', context);
			expect(result).toBe(context.greeting);

			result = processExpression('${greetings.hello}', context);
			expect(result).toBe(context.greetings.hello);
		});

		test('null/undefined value handling', function() {
			let result = processExpression('${greetings.goodnight}', context);
			expect(result).toBe('');
		});

		test('No context handling', function() {
			let result = processExpression('${greeting}');
			expect(result).toBe('');
		});

		test('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let result = processExpression(greeting);
			expect(result).toBe(greeting);
		});
	});


	describe('Iteration expressions', function() {

		test('Value and local name mapping', function() {
			let items = ['a', 'b', 'c'];
			let expression = 'item: ${items}';
			let result = processIterationExpression(expression, { items });
			expect(result.localValueName).toBe('item');
			expect(result.iterable).toBe(items);
		});

		test('null result (fallback)', function() {
			let result = processIterationExpression('Anything');
			expect(result).toBe(null);
		});
	});

});
