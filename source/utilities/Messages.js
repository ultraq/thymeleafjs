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

/**
 * Build a message string from a processed message expression.
 * 
 * @param {object} messageInfo
 * @param {Function} messageResolver
 * @return {Promise<string>}
 */
export async function buildMessage(messageInfo, messageResolver) {
	if (messageResolver) {
		let {key, parameters} = messageInfo;
		return await messageResolver(key, parameters) || '';
	}
	console.log('No message resolver configured');
	return null;
}
