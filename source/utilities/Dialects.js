/* 
 * Copyright 2020, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import {memoize} from '@ultraq/function-utils';

/**
 * Returns the {@link StandardDialect} from a list of dialects.
 * 
 * @param {Array} dialects
 * @return {StandardDialect} The standard dialect from the array of dialects, or
 *   `null` if the dialect doesn't exist in the array.
 */
export const findStandardDialect = memoize((dialects) => {
	return dialects.find(dialect => dialect.name === 'Standard');
});
