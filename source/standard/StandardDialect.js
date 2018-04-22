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

import AttrAttributeProcessor        from './processors/AttrAttributeProcessor';
import CheckedAttributeProcessor     from './processors/CheckedAttributeProcessor';
import ClassAppendAttributeProcessor from './processors/ClassAppendAttributeProcessor';
import EachAttributeProcessor        from './processors/EachAttributeProcessor';
import EmptyableAttributeProcessor,
	{EMPTYABLE_ATTRIBUTE_NAMES}        from './processors/EmptyableAttributeProcessor';
import FragmentAttributeProcessor    from './processors/FragmentAttributeProcessor';
import IfAttributeProcessor          from './processors/IfAttributeProcessor';
import InsertAttributeProcessor      from './processors/InsertAttributeProcessor';
import RemovableAttributeProcessor,
	{REMOVABLE_ATTRIBUTE_NAMES}        from './processors/RemovableAttributeProcessor';
import TextAttributeProcessor        from './processors/TextAttributeProcessor';
import UTextAttributeProcessor       from './processors/UTextAttributeProcessor';
import Dialect                       from '../dialects/Dialect';

/**
 * The out-of-the-box dialect for Thymeleaf, the "Standard Dialect".
 * 
 * @author Emanuel Rabina
 */
export default class StandardDialect extends Dialect {

	static NAME           = 'Standard';
	static DEFAULT_PREFIX = 'thjs';

	/**
	 * Create an instance of this dialect with the name "Standard" and
	 * given prefix, defaulting to "th" if not supplied.
	 * 
	 * @param {String} [prefix='thjs']
	 */
	constructor(prefix = StandardDialect.DEFAULT_PREFIX) {

		super(StandardDialect.NAME, prefix);
	}

	/**
	 * Returns the supported standard processors.
	 * 
	 * @return {Array} A list of the processors included in this dialect.
	 */
	get processors() {

		// TODO: This is a very basic way of imposing the order of attribute
		//       processors.  It's currently ordered in the same way as OG
		//       Thymeleaf.  Figure out a 'proper' way to do the ordering.

		// Order taken from https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#attribute-precedence
		let {prefix} = this;
		return [].concat(
			// Fragment inclusion
			new InsertAttributeProcessor(prefix),

			// Fragment iteration
			new EachAttributeProcessor(prefix),

			// Conditional evaluation
			new IfAttributeProcessor(prefix),

			// Local variable definition
			new AttrAttributeProcessor(prefix),
			new ClassAppendAttributeProcessor(prefix),

			// General attribute modification
			EMPTYABLE_ATTRIBUTE_NAMES.map(attributeName => {
				return new EmptyableAttributeProcessor(prefix, attributeName);
			}),
			REMOVABLE_ATTRIBUTE_NAMES.map(attributeName => {
				return new RemovableAttributeProcessor(prefix, attributeName);
			}),

			// Specific attribute modification
			new CheckedAttributeProcessor(prefix),

			// Text
			new TextAttributeProcessor(prefix),
			new UTextAttributeProcessor(prefix),

			// Fragment specification
			new FragmentAttributeProcessor(prefix)

			// Fragment removal
		);
	}
}
