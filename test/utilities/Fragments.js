/* 
 * Copyright 2019, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import {DEFAULT_PREFIX}  from '../../source/standard/StandardDialect.js';
import {NAME}            from '../../source/standard/processors/FragmentAttributeProcessor.js';
import {extractFragment} from '../../source/utilities/Fragments.js';

/**
 * Tests for the Fragments utility.
 */
describe('utilities/Fragments', function() {

	describe('#extractFragment', function() {
		const fragmentInfo = {
			fragmentName: 'test-fragment',
			templateName: 'test-template'
		};

		let fragmentAttributeName;
		const templateResolver = () => `
			<body>
				<div ${fragmentAttributeName}="${fragmentInfo.fragmentName}">Hi!</div>
				<p ${fragmentAttributeName}="wrong-fragment">Hi!</p>
			</body>
		`;
		const context = {
			templateResolver
		};

		test('Locates fragments by XML name', async function() {
			fragmentAttributeName = `${DEFAULT_PREFIX}:${NAME}`;
			let result = await extractFragment(DEFAULT_PREFIX, fragmentInfo, context);
			expect(result.tagName).toBe('DIV');
			expect(result.textContent).toBe('Hi!');
		});

		test('Locates fragments by data- attribute name', async function() {
			fragmentAttributeName = `data-${DEFAULT_PREFIX}-${NAME}`;
			let result = await extractFragment(DEFAULT_PREFIX, fragmentInfo, context);
			expect(result.tagName).toBe('DIV');
			expect(result.textContent).toBe('Hi!');
		});

		test('No template resolver returns `null`', async function() {
			let mockConsole = jest.spyOn(console, 'log').mockImplementation(() => {});

			let result = await extractFragment(DEFAULT_PREFIX, null, {});
			expect(result).toBe(null);
			expect(mockConsole).toHaveBeenCalledWith('No template resolver configured');

			mockConsole.mockRestore();
		});
	});
});
