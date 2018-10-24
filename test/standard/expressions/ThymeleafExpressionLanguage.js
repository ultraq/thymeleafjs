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

import ExpressionProcessor from '../../../source/standard/expressions/ExpressionProcessor';

/**
 * Tests for the Thymeleaf expression language.
 */
describe('standard/expressions/ThymeleafExpressionLanguage', function() {

	describe('#VariableExpression', function() {
		const context = {
			greeting: 'Good morning!',
			greetings: {
				hello: 'Hello :)',
				goodbye: 'Goodbye :(',
				goodnight: null
			}
		};

		test('Expressions get passed to underlying function', function() {
			let expressionProcessor = new ExpressionProcessor(context);

			let result = expressionProcessor.process('${greeting}');
			expect(result).toBe(context.greeting);

			result = expressionProcessor.process('${greetings.hello}');
			expect(result).toBe(context.greetings.hello);
		});

		test('null/undefined value handling', function() {
			let expressionProcessor = new ExpressionProcessor(context);
			let result = expressionProcessor.process('${greetings.goodnight}');
			expect(result).toBe('');
		});

		test('No context handling', function() {
			let expressionProcessor = new ExpressionProcessor();
			let result = expressionProcessor.process('${greeting}');
			expect(result).toBe('');
		});

		test('Method calls', function() {
			let sum = (a, b) => a + b;
			let expressionProcessor = new ExpressionProcessor({
				sum
			});
			let result = expressionProcessor.process('${sum(1, 2)}');
			expect(result).toBe(sum(1, 2));
		});

		test('Test', function() {
			const date = new Date();
			const format = (date, format) => '' + date + format;
			let expressionProcessor = new ExpressionProcessor({
				'#joda': {
					format
				},
				'#dateFormat': {
					HUMAN: 'human'
				},
				date
			});
			let result = expressionProcessor.process('${#joda.format(date, #dateFormat.HUMAN)}');
			expect(result).toBe(format(date, 'human'));
		});
	});


	describe('#FragmentExpression', function() {
		let expressionProcessor;
		beforeEach(function() {
			expressionProcessor = new ExpressionProcessor();
		});

		test('Extracts the template, fragment, and parameter parts', function() {
			let result = expressionProcessor.process('~{template :: fragment(parameters)}');
			expect(result).toEqual({
				type: 'fragment',
				templateName: 'template',
				fragmentName: 'fragment',
				parameters: '(parameters)'
			});
		});
	});


	describe('#IterationExpression', function() {
		const context = {
			items: ['a', 'b', 'c']
		};
		let expressionProcessor;
		beforeEach(function() {
			expressionProcessor = new ExpressionProcessor(context);
		});

		test('Value and local name mapping', function() {
			let expression = 'item: ${items}';
			let result = expressionProcessor.process(expression);
			expect(result.localValueName).toBe('item');
			expect(result.iterable).toBe(context.items);
		});

		test('Iteration statuses', function() {
			let expresion = 'item,i: ${items}';
			let result = expressionProcessor.process(expresion);
			expect(result.localValueName).toBe('item');
			expect(result.iterable).toBe(context.items);
			expect(result.iterationStatusVariable).toBe('i');
		});
	});


	describe('#StringConcatenation', function() {
		const firstString = 'First string ';
		const secondString = 'second string';
		const firstLine = 'Hey I just met you ';
		const thirdLine = 'But here\'s my number ';
		const context = {
			firstLine,
			firstString,
			thirdLine,
			secondString
		};
		let expressionProcessor;
		beforeEach(function() {
			expressionProcessor = new ExpressionProcessor(context);
		});

		test('Join 2 strings', function() {
			let result = expressionProcessor.process(`'${firstString}' + '${secondString}'`);
			expect(result).toBe(`${firstString}${secondString}`);
		});

		test('Join 2 expressions', function() {
			let result = expressionProcessor.process(`\${firstString} + \${secondString}`);
			expect(result).toBe(`${firstString}${secondString}`);
		});

		test('Join multiple strings or expressions', function() {
			const secondLine = 'And this is crazy ';
			const fourthLine = 'So call me maybe?';
			let expression = `\${firstLine} + '${secondLine}' + \${thirdLine} + '${fourthLine}'`;
			let result = expressionProcessor.process(expression);
			expect(result).toBe(`${firstLine}${secondLine}${thirdLine}${fourthLine}`);
		});
	});


	describe('#LinkExpression', function() {
		const context = {
			greeting: 'hello'
		};
		let expressionProcessor;
		beforeEach(function() {
			expressionProcessor = new ExpressionProcessor(context);
		});

		test('Leaves URLs without special parameters alone', function() {
			let result = expressionProcessor.process('@{/test}');
			expect(result).toBe('/test');
		});

		test('Append special parameters', function() {
			let result = expressionProcessor.process('@{/test(param1=hard-coded-value,param2=${greeting})}');
			expect(result).toBe('/test?param1=hard-coded-value&param2=hello');
		});

		test('Replace parameters in url', function() {
			let result = expressionProcessor.process('@{/{part1}/{part2}/(part1=test,part2=${greeting})}');
			expect(result).toBe('/test/hello/');
		});

		test('Mixed template and query parameters', function() {
			let result = expressionProcessor.process('@{/test/{template}(template=${greeting},query=next)}');
			expect(result).toBe('/test/hello?query=next');
		});
	});


	describe('#LogicalExpression', function() {

		test('${var} === literal', function() {
			let processor = new ExpressionProcessor({
				number: 3
			});
			let result = processor.process('${number} === 3');
			expect(result).toBeTrue();
		});
	});

	describe('#IfThenCondition', function() {

		test('Executes the true branch', function() {
			let processor = new ExpressionProcessor({
				condition: true
			});
			let result = processor.process("${condition} ? 'Hello!'");
			expect(result).toBe('Hello!');
		});
	});


	describe('#IfThenElseCondition', function() {

		test('Executes the true branch', function() {
			let processor = new ExpressionProcessor({
				condition: true
			});
			let result = processor.process("${condition} ? 'Hello!' : 'Goodbye :('");
			expect(result).toBe('Hello!');
		});

		test('Executes the false branch', function() {
			let processor = new ExpressionProcessor({
				condition: false
			});
			let result = processor.process("${condition} ? 'Hello!' : 'Goodbye :('");
			expect(result).toBe('Goodbye :(');
		});
	});


	describe('#Literals', function() {
		let expressionProcessor;
		beforeEach(function() {
			expressionProcessor = new ExpressionProcessor();
		});

		test('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let result = expressionProcessor.process(greeting);
			expect(result).toBe(greeting);
		});
	});

});
