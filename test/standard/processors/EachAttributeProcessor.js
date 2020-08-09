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

import ExpressionProcessor         from '../../../source/standard/expressions/ExpressionProcessor.js';
import ThymeleafExpressionLanguage from '../../../source/standard/expressions/ThymeleafExpressionLanguage.js';
import EachAttributeProcessor      from '../../../source/standard/processors/EachAttributeProcessor.js';
import {createHtml}                from '../../../source/utilities/Dom.js';

import {range} from '@ultraq/array-utils';

/**
 * Tests for the `th:each` attribute processor.
 */
describe('processors/standard/EachAttributeProcessor', function() {

	const processor = new EachAttributeProcessor('test');
	const attribute = `${processor.prefix}:${processor.name}`;
	const baseContext = {
		expressionProcessor: new ExpressionProcessor(ThymeleafExpressionLanguage)
	};

	test('Repeats an element for every item in an iterable', function() {
		let iterationExpression = 'items: ${items}';
		let parent = createHtml(`<ul><li ${attribute}="${iterationExpression}"></li></ul>`);
		let result = processor.process(parent.firstElementChild, attribute, iterationExpression, {
			...baseContext,
			items: range(1, 10)
		});
		expect(result).toBe(true);
		expect(parent.childElementCount).toBe(9);
	});
});
