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

/**
 * Wrapper around the string being parsed, with a position that keeps track of
 * what part of the imput is currently being read/tested.
 * 
 * @author Emanuel Rabina
 */
export default class InputBuffer {

	/**
	 * @private
	 * @type {Number}
	 */
	position = 0;

	/**
	 * @private
	 * @type {Array<Number>}
	 */
	positionStack = [];

	/**
	 * @param {String} input
	 */
	constructor(input) {

		this.input = input;
	}

	/**
	 * Clear the previously {@link #mark}ed position.
	 */
	clear() {

		let lastPosition = this.positionStack.pop();
		if (lastPosition === undefined) {
			throw new Error('Called clear() but no matching mark()');
		}
	}

	/**
	 * Returns whether or not the current position is at the end of the input,
	 * meaning we've exhausted the entire input string.
	 * 
	 * @return {Boolean}
	 */
	exhausted() {

		return this.position === this.input.length;
	}

	/**
	 * Sets a mark at the current position so that it can be returned to by a
	 * matching {@link #reset} call.
	 */
	mark() {

		this.positionStack.push(this.position);
	}

	/**
	 * Convenience method for surrounding a function with a call to {@link #mark},
	 * then {@link #clear} if the result of the function is non-null, or
	 * {@link #reset} if `null`.
	 * 
	 * @template T
	 * @param {Function<T>} func
	 * @return {T}
	 */
	markAndClearOrReset(func) {

		this.mark();
		let result = func();
		if (result !== null) {
			this.clear();
			return result;
		}
		this.reset();
		return null;
	}

	/**
	 * Reads as many characters from the current position as satisfies the given
	 * pattern, returning the read characters and advancing the mark by as many
	 * characters.
	 * 
	 * @param {RegExp} pattern
	 * @return {Array} The array of matched strings, or `null` if the pattern
	 *   didn't match.
	 */
	read(pattern) {

		let remaining = this.input.substring(this.position);
		let leadingWhitespace = remaining.match(/^\s+/);
		if (leadingWhitespace) {
			leadingWhitespace = leadingWhitespace[0];
			remaining = remaining.substring(leadingWhitespace.length);
		}
		let result = new RegExp(pattern.source).exec(remaining);
		if (result) {
			let [value] = result;
			if (remaining.startsWith(value)) {
				this.position += (value.length + (leadingWhitespace ? leadingWhitespace.length : 0));
				return result;
			}
		}
		return null;
	}

	/**
	 * Revert to the last @{link #mark}ed position.
	 */
	reset() {

		let newPosition = this.positionStack.pop();
		if (newPosition === undefined) {
			throw new Error('Called reset() but no matching mark()');
		}
		this.position = newPosition;
	}
}
