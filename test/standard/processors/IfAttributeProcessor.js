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
import IfAttributeProcessor        from '../../../source/standard/processors/IfAttributeProcessor.js';
import {createHtml}                from '../../../source/utilities/Dom.js';

/**
 * Tests for the `th:if` attribute processor.
 */
describe('processors/standard/IfAttributeProcessor', function() {

	const processor = new IfAttributeProcessor('test');
	const attribute = `${processor.prefix}:${processor.name}`;
	const baseContext = {
		expressionProcessor: new ExpressionProcessor(ThymeleafExpressionLanguage)
	};

	test('Renders the element and children if the expression is truthy', function() {
		let expression = '${value}';
		let parent = createHtml(`
			<div>
				<p ${attribute}="${expression}">Hello!</p>
			</div>
		`);
		processor.process(parent.firstElementChild, attribute, expression, {
			...baseContext,
			value: true
		});
		expect(parent.children).toHaveLength(1);
	});

	test('Removes the element and children if the expression is falsey', function() {
		let expression = '${value}';
		let parent = createHtml(`
			<div>
				<p ${attribute}=${expression}>Hello!</p>
			</div>
		`);
		processor.process(parent.firstElementChild, 'th:if', expression, {
			...baseContext,
			value: false
		});
		expect(parent.children).toHaveLength(0);
	});
});
