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

import ExpressionProcessor      from '../../../source/standard/expressions/ExpressionProcessor.js';
import FragmentSignatureGrammar from '../../../source/standard/expressions/FragmentSignatureGrammar.js';

/**
 * Tests for the fragment signature grammar.
 */
describe('standard/expressions/FragmentSignatureGrammar', function() {

	describe('#FragmentSignature', function() {

		test('Extracts the fragment and parameter names', function() {
			let expressionProcessor = new ExpressionProcessor(FragmentSignatureGrammar);
			let result = expressionProcessor.process('fragment(parameter)');
			expect(result).toEqual({
				fragmentName: 'fragment',
				parameterNames: ['parameter']
			});
		});
	});

});
