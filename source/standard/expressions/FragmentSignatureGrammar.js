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

import {AllInput}                       from './AllInput.js';
import ThymeleafRule                    from './ThymeleafRule.js';
import Grammar                          from '../../parser/Grammar.js';
import {Optional, Sequence, ZeroOrMore} from '../../parser/Operators.js';

import {flatten} from '@ultraq/array-utils';

/**
 * Grammar for Thymeleaf fragment signatures.  This is separate from the
 * expression language as these are not expressions, but rather marker syntaxes.
 * 
 * @author Emanuel Rabina
 */
export default new Grammar('Thymeleaf fragment signature',

	new ThymeleafRule('ThymeleafFragmentSignatureRule',
		AllInput('FragmentSignature')
	),

	/**
	 * The target end of a fragment expression, contains the fragment name and
	 * optional parameter names.
	 */
	new ThymeleafRule('FragmentSignature',
		Sequence('FragmentName', Optional('FragmentParameters')),
		([fragmentName, parameterNames]) => context => {
			return {
				fragmentName: fragmentName(context),
				parameterNames: parameterNames ? parameterNames(context) : null
			};
		}
	),
	new ThymeleafRule('FragmentName', /[\w-._]+/),
	new ThymeleafRule('FragmentParameters',
		Sequence(/\(/, ZeroOrMore('FragmentParameterNames'), /\)/),
		([, [parameterNames]]) => context => {
			return parameterNames(context);
		}
	),
	new ThymeleafRule('FragmentParameterNames',
		Sequence('Identifier', ZeroOrMore(Sequence(/,/, 'Identifier'))),
		(namesAndSeparators) => context => {
			return namesAndSeparators ?
				flatten(namesAndSeparators)
					.filter(item => item !== ',')
					.map(name => name(context)) :
				[];
		}
	),


	// Common language basics
	// ======================

	new ThymeleafRule('Identifier', /[#a-zA-Z_][\w]*/)
);
