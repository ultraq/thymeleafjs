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

import StandardEachAttributeProcessor from '../../src/standard/processors/StandardEachAttributeProcessor';

import {range}  from '@ultraq/array-utils';
import {assert} from 'chai';
import h        from 'hyperscript';
import hh       from 'hyperscript-helpers';

const {ul, li} = hh(h);

/**
 * Tests for the `th:each` attribute processor.
 */
describe('processors/StandardEachAttributeProcessor', function() {

	let processor;
	beforeEach(function() {
		processor = new StandardEachAttributeProcessor();
	});

	it('Repeats an element for every item in an iterable', function() {
		let iterationExpression = 'items: ${items}';
		let items = range(1, 10);
		let child = li({ 'th:each': iterationExpression });
		let parent = ul(child);
		let result = processor.process(child, 'th:each', iterationExpression, { items });

		assert.strictEqual(result, 'reprocess');
		assert.strictEqual(parent.childElementCount, 9);
	});
});
