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
import EmptyableAttributeProcessor, {
	EMPTYABLE_ATTRIBUTE_NAMES
}                                  from '../../../source/standard/processors/EmptyableAttributeProcessor.js';
import {createHtml}                from '../../../source/utilities/Dom.js';

/**
 * Tests for the configurable emptyable attribute processor.
 */
describe('processors/standard/EmptyableAttributeProcessor', function() {

	const context = {
		expressionProcessor: new ExpressionProcessor(ThymeleafExpressionLanguage),
		greeting: 'Hello!'
	};

	const attributeName = EMPTYABLE_ATTRIBUTE_NAMES[0];

	test('Replaces the configured value', function() {
		let processor = new EmptyableAttributeProcessor('test', attributeName);
		let attribute = `test:${attributeName}`;
		let attributeValue = '${greeting}';
		let element = createHtml(`<div ${attributeName}="to-be-replaced" ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, context);
		expect(element.getAttribute(attributeName)).toBe(context.greeting);
	});

	test('Empties the configured value', function() {
		let processor = new EmptyableAttributeProcessor('test', attributeName);
		let attribute = `test:${attributeName}`;
		let attributeValue = '${nothing}';
		let element = createHtml(`<div ${attributeName}="to-be-replaced" ${attribute}="${attributeValue}"></div>`);
		processor.process(element, attribute, attributeValue, context);
		expect(element.getAttribute(attributeName)).toBe('');
	});
});
