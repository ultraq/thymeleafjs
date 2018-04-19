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

import StandardAttrAttributeProcessor        from './processors/StandardAttrAttributeProcessor';
import StandardCheckedAttributeProcessor     from './processors/StandardCheckedAttributeProcessor';
import StandardClassAppendAttributeProcessor from './processors/StandardClassAppendAttributeProcessor';
import StandardEachAttributeProcessor        from './processors/StandardEachAttributeProcessor';
import StandardFragmentAttributeProcessor    from './processors/StandardFragmentAttributeProcessor';
import StandardIfAttributeProcessor          from './processors/StandardIfAttributeProcessor';
import StandardInsertAttributeProcessor      from './processors/StandardInsertAttributeProcessor';
import StandardRemovableAttributeProcessor,
	{REMOVABLE_ATTRIBUTE_NAMES}                from './processors/StandardRemovableAttributeProcessor';
import StandardTextAttributeProcessor        from './processors/StandardTextAttributeProcessor';
import StandardUTextAttributeProcessor       from './processors/StandardUTextAttributeProcessor';
import Dialect                               from '../dialects/Dialect';

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
	 * @param {String} [prefix='th']
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
			new StandardInsertAttributeProcessor(prefix),

			// Fragment iteration
			new StandardEachAttributeProcessor(prefix),

			// Conditional evaluation
			new StandardIfAttributeProcessor(prefix),

			// Local variable definition
			new StandardAttrAttributeProcessor(prefix),
			new StandardClassAppendAttributeProcessor(prefix),

			// General attribute modification
			REMOVABLE_ATTRIBUTE_NAMES.map(attributeName => {
				return new StandardRemovableAttributeProcessor(prefix, attributeName);
			}),

			// Specific attribute modification
			new StandardCheckedAttributeProcessor(prefix),

			// Text
			new StandardTextAttributeProcessor(prefix),
			new StandardUTextAttributeProcessor(prefix),

			// Fragment specification
			new StandardFragmentAttributeProcessor(prefix)

			// Fragment removal
		);
	}
}
