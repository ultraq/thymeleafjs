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
import CheckedAttributeProcessor   from '../../../source/standard/processors/CheckedAttributeProcessor.js';
import {createHtml}                from '../../../source/utilities/Dom.js';

/**
 * Tests for the `th:checked` attribute processor.
 */
describe('processors/standard/CheckedAttributeProcessor', function() {

	const processor = new CheckedAttributeProcessor('test');
	const attribute = `${processor.prefix}:${processor.name}`;
	const baseContext = {
		expressionProcessor: new ExpressionProcessor(ThymeleafExpressionLanguage)
	};

	test('Sets the `checked` attribute if the expression is a truthy value', function() {
		['checked', '${greeting}'].forEach(value => {
			let element = createHtml(`<div ${attribute}="${value}"></div>`);
			processor.process(element, attribute, value, {
				...baseContext,
				greeting: 'Hello!'
			});
			expect(element.hasAttribute('checked')).toBe(true);
		});
	});

	test('Removes the `checked` attribute if the expression is a falsey value', function() {
		['', '${greeting}'].forEach(value => {
			let element = createHtml(`<div ${attribute}="${value}"></div>`);
			processor.process(element, attribute, value, {
				...baseContext,
				greeting: null
			});
			expect(element.hasAttribute('checked')).toBe(false);
		});
	});
});
