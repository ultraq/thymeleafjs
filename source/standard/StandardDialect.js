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

import ExpressionProcessor           from './expressions/ExpressionProcessor.js';
import FragmentSignatureGrammar      from './expressions/FragmentSignatureGrammar.js';
import ThymeleafExpressionLanguage   from './expressions/ThymeleafExpressionLanguage.js';
import AttrAttributeProcessor        from './processors/AttrAttributeProcessor.js';
import BlockElementProcessor         from './processors/BlockElementProcessor.js';
import CheckedAttributeProcessor     from './processors/CheckedAttributeProcessor.js';
import ClassAppendAttributeProcessor from './processors/ClassAppendAttributeProcessor.js';
import EachAttributeProcessor        from './processors/EachAttributeProcessor.js';
import EmptyableAttributeProcessor, {
	EMPTYABLE_ATTRIBUTE_NAMES
}                                    from './processors/EmptyableAttributeProcessor.js';
import FragmentAttributeProcessor    from './processors/FragmentAttributeProcessor.js';
import IfAttributeProcessor          from './processors/IfAttributeProcessor.js';
import InsertAttributeProcessor      from './processors/InsertAttributeProcessor.js';
import RemovableAttributeProcessor, {
	REMOVABLE_ATTRIBUTE_NAMES
}                                    from './processors/RemovableAttributeProcessor.js';
import RemoveAttributeProcessor      from './processors/RemoveAttributeProcessor.js';
import ReplaceAttributeProcessor     from './processors/ReplaceAttributeProcessor.js';
import TextAttributeProcessor        from './processors/TextAttributeProcessor.js';
import UnlessAttributeProcessor      from './processors/UnlessAttributeProcessor.js';
import UTextAttributeProcessor       from './processors/UTextAttributeProcessor.js';
import WithAttributeProcessor        from './processors/WithAttributeProcessor.js';
import XmlNsAttributeProcessor       from './processors/XmlNsAttributeProcessor.js';
import Dialect                       from '../dialects/Dialect.js';

/**
 * The out-of-the-box dialect for Thymeleaf, the "Standard Dialect".
 * 
 * @author Emanuel Rabina
 */
export default class StandardDialect extends Dialect {

	// TODO: Move these statics as named exports so that they can be imported
	//       directly instead of having to do DefaultExport.NAME, etc.
	static NAME           = 'Standard';
	static DEFAULT_PREFIX = 'thjs';

	/**
	 * Create an instance of this dialect with the name "Standard" and given
	 * prefix.
	 * 
	 * @param {String} [prefix='thjs']
	 * @param {Object} [isomorphic]
	 */
	constructor(prefix = StandardDialect.DEFAULT_PREFIX, isomorphic) {

		super(StandardDialect.NAME, prefix);
		this.isomorphic = isomorphic;
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
		let {prefix, isomorphic} = this;
		let expressionProcessor = new ExpressionProcessor(ThymeleafExpressionLanguage);
		let fragmentSignatureProcessor = new ExpressionProcessor(FragmentSignatureGrammar);
		return [
			// Fragment inclusion
			new InsertAttributeProcessor(prefix, expressionProcessor, fragmentSignatureProcessor, isomorphic),
			new ReplaceAttributeProcessor(prefix, expressionProcessor, fragmentSignatureProcessor, isomorphic),

			// Fragment iteration
			new EachAttributeProcessor(prefix, expressionProcessor, isomorphic),

			// Conditional evaluation
			new IfAttributeProcessor(prefix, expressionProcessor, isomorphic),
			new UnlessAttributeProcessor(prefix, expressionProcessor, isomorphic),

			// Local variable definition
			new WithAttributeProcessor(prefix, expressionProcessor, isomorphic),

			// General attribute modification
			new AttrAttributeProcessor(prefix, expressionProcessor, isomorphic),
			new ClassAppendAttributeProcessor(prefix, expressionProcessor, isomorphic),
			...EMPTYABLE_ATTRIBUTE_NAMES.map(attributeName => {
				return new EmptyableAttributeProcessor(prefix, attributeName, expressionProcessor, isomorphic);
			}),
			...REMOVABLE_ATTRIBUTE_NAMES.map(attributeName => {
				return new RemovableAttributeProcessor(prefix, attributeName, expressionProcessor, isomorphic);
			}),

			// Specific attribute modification
			new CheckedAttributeProcessor(prefix, expressionProcessor, isomorphic),

			// Text
			new TextAttributeProcessor(prefix, expressionProcessor, isomorphic),
			new UTextAttributeProcessor(prefix, expressionProcessor, isomorphic),

			// Fragment specification
			new FragmentAttributeProcessor(prefix, isomorphic),

			// Fragment removal
			new RemoveAttributeProcessor(prefix, isomorphic),

			// Element processors
			new BlockElementProcessor(prefix),

			// Misc
			new XmlNsAttributeProcessor(prefix, isomorphic)
		];
	}
}
