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

import ExpressionProcessor         from '../../../source/standard/expressions/ExpressionProcessor.js';
import ThymeleafExpressionLanguage from '../../../source/standard/expressions/ThymeleafExpressionLanguage.js';

/**
 * Tests for the Thymeleaf expression language.
 */
describe('standard/expressions/ThymeleafExpressionLanguage', function() {

	let expressionProcessor;
	beforeAll(function() {
		expressionProcessor = new ExpressionProcessor(ThymeleafExpressionLanguage);
	});

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
			let result = expressionProcessor.process('${greeting}', context);
			expect(result).toBe(context.greeting);

			result = expressionProcessor.process('${greetings.hello}', context);
			expect(result).toBe(context.greetings.hello);
		});

		test('Built-in properties', function() {
			let greetingsList = [
				'Hello :)',
				'Goodbye :('
			];
			let result = expressionProcessor.process('${greetingsList.length}', {
				greetingsList
			});
			expect(result).toBe(greetingsList.length);
		});

		test('null/undefined value handling', function() {
			let result = expressionProcessor.process('${greetings.goodnight}', context);
			expect(result).toBe('');
		});

		test('No context handling', function() {
			let result = expressionProcessor.process('${greeting}');
			expect(result).toBe('');
		});

		test('Method calls', function() {
			let sum = (a, b) => a + b;
			let result = expressionProcessor.process('${sum(1, 2)}', {
				sum
			});
			expect(result).toBe(sum(1, 2));
		});

		test('Utility function calls', function() {
			const date = new Date();
			const format = (date, format) => '' + date + format;
			let result = expressionProcessor.process('${#joda.format(date, #dateFormat.HUMAN)}', {
				'#joda': {
					format
				},
				'#dateFormat': {
					HUMAN: 'human'
				},
				date
			});
			expect(result).toBe(format(date, 'human'));
		});

		test('Negation', function() {
			let result = expressionProcessor.process('${!happy}', {
				happy: true
			});
			expect(result).toBe(false);
		});

		describe('Array Access', () => {
			const arrayContext = {
				days: [ 'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
				nestedArrays: [
					{
						name: 'User 1',
						roles: ['admin']
					},
					{
						name: 'User 2',
						roles: ['editor', 'member']
					}
				]
			};

			test('Should be able to access plain array by index', function() {
				let result = expressionProcessor.process('${days[0]}', arrayContext);
				expect(result).toBe('Sat');

				result = expressionProcessor.process('${days[1]}', arrayContext);
				expect(result).toBe('Sun');
			});

			test('Should be able to access nested array by index', function() {
				let result = expressionProcessor.process('${nestedArrays[0].name}', arrayContext);
				expect(result).toBe('User 1');

				result = expressionProcessor.process('${nestedArrays[1].name}', arrayContext);
				expect(result).toBe('User 2');

				result = expressionProcessor.process('${nestedArrays[0].roles[0]}', arrayContext);
				expect(result).toBe('admin');

				result = expressionProcessor.process('${nestedArrays[1].roles[1]}', arrayContext);
				expect(result).toBe('member');
			});
		});
	});

	describe('LiteralSubstitution', () => {
		test('Expressions inside template get parsed', function() {
			let name = 'John', surname = 'Doe';

			let result = expressionProcessor.process('|How are you ${name}, ${surname}?|', {
				name, surname
			});
			expect(result).toBe(`How are you ${name}, ${surname}?`);
		});
	});

	describe('#MessageExpression', function() {

		test('Can read the key and parameter parts', function() {
			const context = {
				messageResolver: jest.fn(),
				greeting: 'Hello!'
			};
			let result = expressionProcessor.process('#{myMessage(${greeting})}', context);
			expect(result).toEqual({
				type: 'message',
				key: 'myMessage',
				parameters: [
					'Hello!'
				]
			});
		});
	});


	describe('#FragmentExpression', function() {

		test('Extracts the template, fragment, and parameter parts', function() {
			const context = {
				parameter: '1234'
			};
			let result = expressionProcessor.process('~{template :: fragment(${parameter})}', context);
			expect(result).toEqual({
				type: 'fragment',
				templateName: 'template',
				fragmentName: 'fragment',
				parameters: [context.parameter]
			});
		});
	});


	describe('#IterationExpression', function() {
		const context = {
			items: ['a', 'b', 'c']
		};

		test('Value and local name mapping', function() {
			let expression = 'item: ${items}';
			let result = expressionProcessor.process(expression, context);
			expect(result.localValueName).toBe('item');
			expect(result.iterable).toBe(context.items);
		});

		test('Iteration statuses', function() {
			let expresion = 'item,i: ${items}';
			let result = expressionProcessor.process(expresion, context);
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

		test('Join 2 strings', function() {
			let result = expressionProcessor.process(`'${firstString}' + '${secondString}'`, context);
			expect(result).toBe(`${firstString}${secondString}`);
		});

		test('Join 2 expressions', function() {
			let result = expressionProcessor.process(`\${firstString} + \${secondString}`, context);
			expect(result).toBe(`${firstString}${secondString}`);
		});

		test('Join multiple strings or expressions', function() {
			const secondLine = 'And this is crazy ';
			const fourthLine = 'So call me maybe?';
			let expression = `\${firstLine} + '${secondLine}' + \${thirdLine} + '${fourthLine}'`;
			let result = expressionProcessor.process(expression, context);
			expect(result).toBe(`${firstLine}${secondLine}${thirdLine}${fourthLine}`);
		});

		test('Allow escaped quotes in strings', function() {
			let result = expressionProcessor.process("'Thumbnail for \\'' + ${myImage} + '\\''", { // eslint-disable-line
				myImage: 'My Image'
			});
			expect(result).toBe("Thumbnail for 'My Image'");
		});
	});


	describe('#ScopedVariables', function() {

		test('Returns information about the scoped variable', function() {
			let aliasName = 'someKey';
			let aliasValue = 'Hello!';
			let result = expressionProcessor.process(`${aliasName}=\${someValue}`, {
				someValue: aliasValue
			});
			expect(result).toEqual(expect.arrayContaining([
				expect.objectContaining({
					name: aliasName,
					value: aliasValue
				})
			]));
		});
	});


	describe('#LinkExpression', function() {
		const context = {
			greeting: 'hello'
		};

		test('Leaves URLs without special parameters alone', function() {
			let result = expressionProcessor.process('@{/test}', context);
			expect(result).toBe('/test');
		});

		test('Append special parameters', function() {
			let result = expressionProcessor.process('@{/test(param1=hard-coded-value,param2=${greeting})}', context);
			expect(result).toBe('/test?param1=hard-coded-value&param2=hello');
		});

		test('Replace parameters in url', function() {
			let result = expressionProcessor.process('@{/{part1}/{part2}/(part1=test,part2=${greeting})}', context);
			expect(result).toBe('/test/hello/');
		});

		test('Mixed template and query parameters', function() {
			let result = expressionProcessor.process('@{/test/{template}(template=${greeting},query=next)}', context);
			expect(result).toBe('/test/hello?query=next');
		});
	});


	describe('#LogicalOperation', function() {

		test('a && b', function() {
			['&&', 'and'].forEach(symbol => {
				let result = expressionProcessor.process(`\${a} ${symbol} \${b}`, {
					a: true,
					b: true
				});
				expect(result).toBe(true);
			});
		});

		test('a || b', function() {
			['||', 'or'].forEach(symbol => {
				let result = expressionProcessor.process(`\${a} ${symbol} \${b}`, {
					a: true,
					b: false
				});
				expect(result).toBe(true);
			});
		});
	});

	describe('#EqualityOperation', function() {

		test('${var} === literal', function() {
			['===', 'eq'].forEach(symbol => {
				let result = expressionProcessor.process(`\${number} ${symbol} 3`, {
					number: 3
				});
				expect(result).toBe(true);
			});
		});

		test('${var} !== literal', function() {
			['!==', 'ne'].forEach(symbol => {
				let result = expressionProcessor.process(`\${number} ${symbol} 3`, {
					number: 3
				});
				expect(result).toBe(false);
			});
		});
	});

	describe('#IfThenCondition', function() {

		test('Executes the true branch', function() {
			let result = expressionProcessor.process("${condition} ? 'Hello!'", {
				condition: true
			});
			expect(result).toBe('Hello!');
		});
	});


	describe('#IfThenElseCondition', function() {

		test('Executes the true branch', function() {
			let result = expressionProcessor.process("${condition} ? 'Hello!' : 'Goodbye :('", {
				condition: true
			});
			expect(result).toBe('Hello!');
		});

		test('Executes the false branch', function() {
			let result = expressionProcessor.process("${condition} ? 'Hello!' : 'Goodbye :('", {
				condition: false
			});
			expect(result).toBe('Goodbye :(');
		});
	});


	describe('#Literals', function() {

		test('Verbatim expressions (fallback)', function() {
			let greeting = 'Hello!';
			let result = expressionProcessor.process(greeting);
			expect(result).toBe(greeting);
		});
	});

});
