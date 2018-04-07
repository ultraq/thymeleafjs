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

/**
 * An iteration expression is the name of the variable for each loop, followed
 * by the collection being iterated over.
 * 
 * @author Emanuel Rabina
 */
export default class IterationExpression extends Expression {

	/**
	 * @param {String} expression
	 * @param {String} localValueName
	 * @param {VariableExpression} collectionVariable
	 */
	constructor(expression, localValueName, collectionVariable) {

		super(expression);
		this.localValueName     = localValueName;
		this.collectionVariable = collectionVariable;
	}

	/**
	 * Return information on the iteration.
	 * 
	 * @param {Object} context
	 * @return {Object}
	 */
	execute(context) {

		return {
			localValueName: this.localValueName,
			iterable: this.collectionVariable.execute(context)
		};
	}
}
