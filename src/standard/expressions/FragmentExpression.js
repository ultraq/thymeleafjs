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

import OptionalExpression from '../../parser/OptionalExpression';
import Rule               from '../../parser/Rule';
import SimpleExpression   from '../../parser/SimpleExpression';
import SequenceExpression from '../../parser/SequenceExpression';

import {navigate} from '@ultraq/object-utils';


export const TemplateName = new Rule('TemplateName',
	new SimpleExpression(/[\w-\._]+/)
);

export const FragmentName = new Rule('FragmentName',
	new SimpleExpression(/[\w-\._]+/)
);

// TODO: We're not doing anything with these yet
export const FragmentParameters = new Rule('FragmentParameters',
	new OptionalExpression(/\(.+\)/)
);

/**
 * Fragment expressions, `~{template :: fragment(parameters)}`.  A locator for a
 * piece of HTML in the same or another template.
 * 
 * @author Emanuel Rabina
 */
export default new Rule('FragmentExpression',
	new SequenceExpression(
		/~{/,
		'TemplateName',
		/::/,
		'FragmentName',
		'FragmentParameters',
		/}/
	),
	([, templateName, , fragmentName, parameters]) => context => {

		// TODO: Executing a fragment expression should locate and return the fragment
		// TODO: Process parameters
		let prefix = navigate(context, 'templateResolver.prefix');
		let suffix = navigate(context, 'templateResolver.suffix');
		return {
			templateName: (prefix || '') + templateName + (suffix || ''),
			fragmentName,
			parameters
		};
	}
);
