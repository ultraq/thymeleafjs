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

import Dialect                            from '../dialects/Dialect';
import StandardAttrAttributeProcessor     from './processors/StandardAttrAttributeProcessor';
import StandardEachAttributeProcessor     from './processors/StandardEachAttributeProcessor';
import StandardFragmentAttributeProcessor from './processors/StandardFragmentAttributeProcessor';
import StandardHrefAttributeProcessor     from './processors/StandardHrefAttributeProcessor';
import StandardIfAttributeProcessor       from './processors/StandardIfAttributeProcessor';
import StandardSrcAttributeProcessor      from './processors/StandardSrcAttributeProcessor';
import StandardTextAttributeProcessor     from './processors/StandardTextAttributeProcessor';
import StandardUTextAttributeProcessor    from './processors/StandardUTextAttributeProcessor';

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
		let {prefix} = this;
		return [
			new StandardEachAttributeProcessor(prefix),
			new StandardIfAttributeProcessor(prefix),
			new StandardAttrAttributeProcessor(prefix),
			new StandardHrefAttributeProcessor(prefix),
			new StandardSrcAttributeProcessor(prefix),
			new StandardTextAttributeProcessor(prefix),
			new StandardUTextAttributeProcessor(prefix),
			new StandardFragmentAttributeProcessor(prefix)
		];
	}
}
