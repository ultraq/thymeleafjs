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

import InputBuffer from '../../src/parser/InputBuffer';

/**
 * Tests for the mark/reset-wrapped string.
 */
describe('parser/InputBuffer', function() {

	let inputBuffer;
	beforeEach(function() {
		inputBuffer = new InputBuffer('abc123');
	});

	describe('#exhausted', function() {

		test('Buffer is exhausted once all input has been read', function() {
			inputBuffer.read(/\w+/);
			expect(inputBuffer.exhausted()).toBeTrue();
		});

		test('Buffer not exhausted if not all input has been read', function() {
			inputBuffer.read(/[a-z]+/);
			expect(inputBuffer.exhausted()).toBeFalse();
		});
	});

	describe('#mark/#reset', function() {

		test('A mark lets you revert to that position on reset', function() {
			inputBuffer.mark();
			expect(inputBuffer.read(/abc/)).toBe('abc');
			expect(inputBuffer.read(/abc/)).toBeNull();
			inputBuffer.reset();
			expect(inputBuffer.read(/abc/)).toBe('abc');
		});

		test('Calling reset without a matching mark throws an error', function() {
			expect(() => inputBuffer.reset()).toThrow();
		});
	});

	describe('#read', function() {

		test('Returns consumed input that matches a given pattern', function() {
			let read = inputBuffer.read(/\w+/);
			expect(read).toBe('abc123');
		});

		test('Input is only consumed from the beginning of the current read position', function() {
			expect(inputBuffer.read(/\d+/)).toBeNull();
			expect(inputBuffer.read(/[a-z]+/)).toBe('abc');
			expect(inputBuffer.read(/\d+/)).toBe('123');
		});

		test("Patterns that don't match return null", function() {
			expect(inputBuffer.read(/xyz/)).toBeNull();
		});
	});

});
