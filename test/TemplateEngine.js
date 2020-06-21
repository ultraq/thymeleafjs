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

import {DEFAULT_CONFIGURATION} from '../source/Configurations.js';
import TemplateEngine          from '../source/TemplateEngine.js';
import Dialect                 from '../source/dialects/Dialect.js';
import StandardDialect         from '../source/standard/StandardDialect.js';
import {promisify}             from '../source/utilities/Functions';

import {range} from '@ultraq/array-utils';
import fs      from 'fs';
import path    from 'path';

/**
 * Tests for the Thymeleaf processing functions.
 */
describe('TemplateEngine', function() {

	describe('Expression objects', function() {

		class TestDialect1 extends Dialect {
			constructor() {
				super('Test1');
			}
			expressionObjects = {
				'#obj1': {
					sum: (a, b) => a + b
				}
			}
		}
		class TestDialect2 extends Dialect {
			constructor() {
				super('Test2');
			}
			expressionObjects = {
				'#obj2': {
					multiply: (a, b) => a * b
				}
			}
		}

		const templateEngine = new TemplateEngine({
			...DEFAULT_CONFIGURATION,
			dialects: [
				new StandardDialect(),
				new TestDialect1(),
				new TestDialect2()
			]
		});

		test('Combine expression objects across all dialects in a single one', function() {
			let {expressionObjects} = templateEngine;
			expect(expressionObjects).toHaveProperty('#obj1');
			expect(expressionObjects).toHaveProperty('#obj2');
		});

		test('Expression objects available in processing', async function() {
			let htmlString = await templateEngine.process(
				'<div thjs:text="${#obj1.sum(2, 2)}">Result in here</div>'
			);
			expect(htmlString).toEqual(expect.stringContaining('<div>4</div>'));

			htmlString = await templateEngine.process(
				'<div thjs:text="${#obj2.multiply(3, 2)}">Result in here</div>'
			);
			expect(htmlString).toEqual(expect.stringContaining('<div>6</div>'));
		});
	});

	function removeWhitespace(string) {
		return string.replace(/([\t\n])/g, '');
	}

	test('#processFile', function() {
		let templateEngine = new TemplateEngine({
			...DEFAULT_CONFIGURATION,
			templateResolver: templateName => {
				return fs.readFileSync(path.resolve(process.cwd(), `./test/${templateName}.html`));
			}
		});
		return Promise.all([
			templateEngine.processFile(path.join(__dirname, 'template.html'), {
				normalizeCss: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.css',
				greeting: 'Hello!',
				showGreeting: true,
				numbers: range(1, 10)
			}),
			promisify(fs.readFile)(path.join(__dirname, 'template-expected.html'))
				.then(expectedTemplateData => expectedTemplateData.toString())
		])
			.then(([processedTemplate, expectedTemplate]) => {
				expect(removeWhitespace(processedTemplate)).toBe(removeWhitespace(expectedTemplate));
			});
	});
});
