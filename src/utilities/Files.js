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

/* global ENVIRONMENT */

/**
 * Return a promise of the file data at the given path in a node environment, or
 * an instant rejection in a browser environment.
 * 
 * @param {String} filePath
 * @return {Promise}
 */
export function readFile(filePath) {

	return ENVIRONMENT === 'browser' ?
		Promise.reject('Cannot use fs.readFile inside a browser') :
		new Promise((resolve, reject) => {
			require('fs').readFile(filePath, (error, data) => {
				if (error) {
					reject(new Error(error));
				}
				else {
					resolve(data);
				}
			});
		});
}
