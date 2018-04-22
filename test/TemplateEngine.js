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

import {DEFAULT_CONFIGURATION}     from '../source/Configurations';
import TemplateEngine              from '../source/TemplateEngine';
import LocalModuleTemplateResolver from '../source/templateresolver/LocalModuleTemplateResolver';
import {promisify}                 from '../source/utilities/Functions';

import {range}  from '@ultraq/array-utils';
import fs       from 'fs';
import path     from 'path';

/**
 * Tests for the Thymeleaf processing functions.
 */
describe('TemplateEngine', function() {

	function removeWhitespace(string) {
		return string.replace(/(\t|\n)/g, '');
	}

	test('#processFile', function() {
		let inputTemplatePath = path.join(__dirname, 'template.html');

		let templateEngine = new TemplateEngine({
			...DEFAULT_CONFIGURATION,
			templateResolver: new LocalModuleTemplateResolver('./test/', '.html')
		});
		return Promise.all([
			templateEngine.processFile(inputTemplatePath, {
				normalizeCss: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.css',
				greeting: 'Hello!',
				showGreeting: true,
				numbers: range(1, 10)
			}),
			promisify(fs.readFile)(path.join(__dirname, 'template-expected.html'))
		])
			.then(([processedTemplate, expectedTemplate]) => {
				expect(removeWhitespace(processedTemplate)).toBe(removeWhitespace(expectedTemplate.toString()));
			});
	});
});
