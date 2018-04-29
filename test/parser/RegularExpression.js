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

import InputBuffer         from '../../source/parser/InputBuffer';
import Parser              from '../../source/parser/Parser';
import {RegularExpression} from '../../source/parser/RegularExpression';

/**
 * Tests for the special regex matcher.
 */
describe('parser/RegularExpression', function() {

	test('Matching groups execute their corresponding processors', function() {
		let processor = RegularExpression(/([a-z]*)?([0-9]*)?/, [/abc/, /123/]);
		let parser = new Parser();
		let parseSpy = jest.spyOn(parser, 'parseWithExpression');
		let result = processor(new InputBuffer('abc'), parser);
		expect(result[0]).toBe('abc');
		expect(parseSpy).toHaveBeenCalledWith(expect.objectContaining({ input: 'abc' }), /abc/);

		parser = new Parser();
		parseSpy = jest.spyOn(parser, 'parseWithExpression');
		result = processor(new InputBuffer('123'), parser);
		expect(result[0]).toBe('123');
		expect(parseSpy).toHaveBeenCalledWith(expect.objectContaining({ input: '123' }), /123/);
	});
});
