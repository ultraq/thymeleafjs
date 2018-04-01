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

import InputBuffer from './InputBuffer';

/**
 * A recursive descent parser for any parsing expression grammar defined by the
 * constructs in this module.
 * 
 * TODO: Own module?
 * 
 * @author Emanuel Rabina
 */
export default class Parser {

	/**
	 * @param {Grammar} grammar
	 */
	constructor(grammar) {

		this.grammar = grammar;
	}

	/**
	 * Parse a string, attempting to build the parse tree defined by the rules in
	 * the configured grammar.  Parsing is considered successful when there are no
	 * more non-terminating symbols in the grammar and all of the input has been
	 * read.
	 * 
	 * @param {String} input
	 * @return {Object} The parse tree if the input could be parsed, `null`
	 *   otherwise.
	 */
	parse(input) {

		let inputBuffer = new InputBuffer(input);
		let startingRule = this.grammar.startingRule;
		let parseTree = startingRule.parse({
			grammar: this.grammar,
			input: inputBuffer
		});

		if (!parseTree || !inputBuffer.exhausted()) {
			throw new Error(`Failed to parse "${input}"`);
		}
		return parseTree;
	}
}
