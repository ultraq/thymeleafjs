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

import {buildMessage} from '../../source/utilities/Messages.js';

/**
 * Tests for the message utilities.
 */
describe('utilities/Messages', function() {

	describe('#buildMessage', function() {

		test('Calls the function with the key, parameters, and context', async function() {
			const key = 'key';
			const parameters = [];
			const messageResolver = jest.fn();
			await buildMessage({key, parameters}, messageResolver);
			expect(messageResolver).toHaveBeenCalledWith(key, parameters);
		});

		test('No message resolver returns `null`', async function() {
			let mockConsole = jest.spyOn(console, 'log').mockImplementation(() => {});

			let result = await buildMessage(null, null);
			expect(result).toBe(null);
			expect(mockConsole).toHaveBeenCalledWith('No message resolver configured');

			mockConsole.mockRestore();
		});
	});
});
