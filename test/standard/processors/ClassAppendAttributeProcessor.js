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

import ExpressionProcessor           from '../../../source/standard/expressions/ExpressionProcessor.js';
import ThymeleafExpressionLanguage   from '../../../source/standard/expressions/ThymeleafExpressionLanguage.js';
import ClassAppendAttributeProcessor from '../../../source/standard/processors/ClassAppendAttributeProcessor.js';
import {createHtml}                  from '../../../source/utilities/Dom.js';

/**
 * Tests for the `th:classappend` processor.
 */
describe('standard/processors/ClassAppendAttributeProcessor', function() {

	const processor = new ClassAppendAttributeProcessor('test');
	const attribute = `${processor.prefix}:${processor.name}`;
	const baseContext = {
		expressionProcessor: new ExpressionProcessor(ThymeleafExpressionLanguage)
	};

	test('Adds a class to an element', function() {
		let extraClass = 'added';
		let attributeValue = extraClass;
		let element = createHtml(`<div ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, {
			...baseContext
		});
		expect(element.classList.contains(extraClass)).toBe(true);
	});

	test('But not if the expression is falsey', function() {
		let attributeValue = '${extraClass}';
		let element = createHtml(`<div class="existing-class" ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, {
			...baseContext,
			extraClass: null
		});
		expect(element.className).toBe('existing-class');
	});
});
