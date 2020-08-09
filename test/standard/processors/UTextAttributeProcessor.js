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
import UTextAttributeProcessor     from '../../../source/standard/processors/UTextAttributeProcessor.js';
import {createHtml}                from '../../../source/utilities/Dom.js';

/**
 * Tests for the `th:utext` attribute processor.
 */
describe('processors/standard/UTextAttributeProcessor', function() {

	const processor = new UTextAttributeProcessor('test');
	const attribute = `${processor.prefix}:${processor.name}`;
	const baseContext = {
		expressionProcessor: new ExpressionProcessor(ThymeleafExpressionLanguage)
	};

	test("Replaces an element's text content", function() {
		let text = 'Hello!';
		let element = createHtml(`<div ${attribute}="${text}">Goodbye</div>`);
		processor.process(element, attribute, text, {
			...baseContext
		});
		expect(element.innerHTML).toBe(text);
	});

	test("Doesn't escape special HTML characters in the text content", function() {
		let text = '<script></script>';
		let element = createHtml(`<div ${attribute}="${text}">HTML stuffs</div>`);
		processor.process(element, attribute, text, {
			...baseContext
		});
		expect(element.innerHTML).toBe(text);
	});

	test('Cleans up encountered attributes', function() {
		let element = createHtml(`<div ${attribute}=""></div>`);
		processor.process(element, attribute, '', {
			...baseContext
		});
		expect(element.hasAttribute(attribute)).toBe(false);
	});
});
