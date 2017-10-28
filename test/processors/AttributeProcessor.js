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

import AttributeProcessor              from '../../src/processors/AttributeProcessor';
import {createThymeleafAttributeValue} from '../../src/utilities/Dom';

import {assert} from 'chai';
import h        from 'hyperscript';
import hh       from 'hyperscript-helpers';

const {div} = hh(h);

/**
 * Tests for the base attribute processor.
 */
describe('processors/AttributeProcessor', function() {

	const PREFIX = 'test';
	const NAME   = 'greeting';

	let processor;
	before(function() {
		processor = new AttributeProcessor(PREFIX, NAME);
	});

	it('Match XML attributes', function() {
		let attribute = `${PREFIX}:${NAME}`;
		let element = createThymeleafAttributeValue(div(), attribute, 'hello');
		let match = processor.matches(element);
		assert.strictEqual(match, attribute);
	});

	it('Match data- attributes', function() {
		let attribute = `data-${PREFIX}-${NAME}`;
		let element = createThymeleafAttributeValue(div(), attribute, 'hello');
		let match = processor.matches(element);
		assert.strictEqual(match, attribute);
	});

	it('Return `null` if no match', function() {
		let element = createThymeleafAttributeValue(div(), 'test:something-else', 'hello');
		let match = processor.matches(element);
		assert.isNull(match);
	});
});
