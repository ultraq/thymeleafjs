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
	processIterationExpression,
	processLinkExpression
} from '../../src/expressions/ExpressionProcessor';

import {assert} from 'chai';

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

		it('Simple object navigation', function() {
			let result = processExpression('${greeting}', context);
			assert.strictEqual(result, context.greeting);
		});

		it('Complex object navigation', function() {
			let result = processExpression('${greetings.hello}', context);
			assert.strictEqual(result, context.greetings.hello);
		});

		it('null/undefined value handling', function() {
			let result = processExpression('${greetings.goodnight}', context);
			assert.strictEqual(result, '');
		});

		it('No context handling', function() {
			let result = processExpression('${greeting}');
			assert.strictEqual(result, '');
		});

		it('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let result = processExpression(greeting);
			assert.strictEqual(result, greeting);
		});
	});


	describe('Link expressions', function() {
		const context = {
			greeting: 'hello'
		};

		it('Leaves URLs without special parameters alone', function() {
			let result = processLinkExpression('@{/test}');
			assert.strictEqual(result, '/test');
		});

		it('Append special parameters', function() {
			let result = processLinkExpression('@{/test(param1=hard-coded-value,param2=${greeting})}', context);
			assert.strictEqual(result, '/test?param1=hard-coded-value&param2=hello');
		});

		it('Replace parameters in url', function() {
			let result = processLinkExpression('@{/{part1}/{part2}/(part1=test,part2=${greeting})}', context);
			assert.strictEqual(result, '/test/hello/');
		});

		it('Mixed template and query parameters', function() {
			let result = processLinkExpression('@{/test/{template}(template=${greeting},query=next)}', context);
			assert.strictEqual(result, '/test/hello?query=next');
		});

		it('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let result = processLinkExpression(greeting);
			assert.strictEqual(result, greeting);
		});
	});


	describe('Iteration expressions', function() {

		it('Value and local name mapping', function() {
			let items = ['a', 'b', 'c'];
			let expression = 'item: ${items}';
			let result = processIterationExpression(expression, { items });
			assert.strictEqual(result.localValueName, 'item');
			assert.strictEqual(result.iterable, items);
		});

		it('null result (fallback)', function() {
			let result = processIterationExpression('Anything');
			assert.strictEqual(result, null);
		});
	});

});
