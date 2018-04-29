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

import InputBuffer                 from '../../../source/parser/InputBuffer';
import Parser                      from '../../../source/parser/Parser';
import ThymeleafExpressionLanguage from '../../../source/standard/expressions/ThymeleafExpressionLanguage';

/**
 * Tests for the Thymeleaf expression language.
 */
describe('standard/expressions/ThymeleafExpressionLanguage', function() {

	const parser = new Parser(ThymeleafExpressionLanguage);

	describe('#LogicalExpression', function() {

		test('${var} === literal', function() {
			let logicalExpressionProcessor = ThymeleafExpressionLanguage.accept(
				new InputBuffer('${number} === 3'),
				parser
			);
			let result = logicalExpressionProcessor({
				number: 3
			});
			expect(result).toBeTrue();
		});
	});

	describe('#IfThenCondition', function() {

		test('Executes the true branch', function() {
			let ifThenProcessor = ThymeleafExpressionLanguage.accept(
				new InputBuffer("${condition} ? 'Hello!'"),
				parser
			);
			let result = ifThenProcessor({
				condition: true
			});
			expect(result).toBe('Hello!');
		});
	});

	describe('#IfThenElseCondition', function() {

		test('Executes the true branch', function() {
			let ifThenElseProcessor = ThymeleafExpressionLanguage.accept(
				new InputBuffer("${condition} ? 'Hello!' : 'Goodbye :('"),
				parser
			);
			let result = ifThenElseProcessor({
				condition: true
			});
			expect(result).toBe('Hello!');
		});

		test('Executes the false branch', function() {
			let ifThenElseProcessor = ThymeleafExpressionLanguage.accept(
				new InputBuffer("${condition} ? 'Hello!' : 'Goodbye :('"),
				parser
			);
			let result = ifThenElseProcessor({
				condition: false
			});
			expect(result).toBe('Goodbye :(');
		});
	});

});
