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

import Expression from './Expression';
import {navigate} from '@ultraq/object-utils/object-utils.node';

/**
 * A fragment expression describes a piece of HTML in the same or another
 * template.
 * 
 * @author Emanuel Rabina
 */
export default class FragmentExpression extends Expression {

	/**
	 * @param {String} expression
	 * @param {String} templateName
	 * @param {String} fragmentName
	 * @param {String} parameters
	 */
	constructor(expression, templateName, fragmentName, parameters) {

		super(expression);
		this.templateName = templateName;
		this.fragmentName = fragmentName;
		this.parameters   = parameters; // TODO: Do something with these
	}

	/**
	 * Return an object describing the template and fragment parts.
	 * 
	 * TODO: Executing a fragment expression should locate and return the fragment
	 * 
	 * @param {Object} context
	 * @return {Object}
	 */
	execute(context) {

		// TODO: Process parameters

		let prefix = navigate(context, 'templateResolver.prefix');
		let suffix = navigate(context, 'templateResolver.suffix');
		return {
			templateName: (prefix || '') + this.templateName + (suffix || ''),
			fragmentName: this.fragmentName,
			parameters:   this.parameters
		};
	}
}
