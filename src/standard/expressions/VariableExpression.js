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

import {navigate} from '@ultraq/object-utils';

/**
 * A variable expression represents a value to be retrieved from the current
 * context.
 * 
 * @author Emanuel Rabina
 */
export default class VariableExpression extends Expression {

	/**
	 * @param {String} expression
	 * @param {String} variablePath
	 */
	constructor(expression, variablePath) {

		super(expression);
		this.variablePath = variablePath;
	}

	/**
	 * Evaluate the variable expression with the given context.
	 * 
	 * @param {Object} [context={}]
	 * @return {String} The result of evaluating the variable expression.
	 */
	execute(context = {}) {

		return navigate(context, this.variablePath) || '';
	}
}
