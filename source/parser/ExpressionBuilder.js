/* 
 * Copyright 2021, Emanuel Rabina (http://www.ultraq.net.nz/)
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

import {OneOrMore, Optional, OrderedChoice, Sequence, ZeroOrMore} from './Operators.js';
import Parser                                                     from './Parser.js';
import ParsingExpressionGrammar                                   from './ParsingExpressionGrammar.js';

/**
 * A function for building an expression from a string written in the syntax of
 * parsing expression grammars, see: https://en.wikipedia.org/wiki/Parsing_expression_grammar
 * 
 * This saves having to chain operator functions manually, so instead of coding
 * `Optional(Expression)` you can write `"Expression?"`.
 * 
 * @param {String} expressionString
 * @return {Matchable}
 */
export function buildExpression(expressionString) {

	let result = new Parser(ParsingExpressionGrammar).parse(expressionString);
	return result;

	// if (!expressionString) {
	// 	return '';
	// }
	//
	// // If the string contains brackets, then divide the string into expressions
	// // for before the brackets, the bracketed section, and after the brackets.
	// let blockStart = expressionString.indexOf('(');
	// if (blockStart !== -1) {
	// 	let result = [];
	// 	let head = expressionString.substring(0, blockStart).trim();
	// 	if (head) {
	// 		result.push(buildExpression(head));
	// 	}
	// 	let blockEnd = findBlockEnd(expressionString, blockStart);
	// 	let block = expressionString.substring(blockStart + 1, blockEnd);
	// 	if (block.endsWith('*')) {
	// 		result.push(ZeroOrMore(buildExpression(block.slice(1, -2))));
	// 	}
	// 	else if (block.endsWith('+')) {
	// 		result.push(OneOrMore(buildExpression(block.slice(1, -2))));
	// 	}
	// 	else if (block.endsWith('?')) {
	// 		result.push(Optional(buildExpression(block.slice(1, -2))));
	// 	}
	// 	else {
	// 		result.push(buildExpression(block.slice(1, -1)));
	// 	}
	// 	let tail = expressionString.substring(blockEnd + 1).trim();
	// 	if (tail) {
	// 		result.push(buildExpression(tail));
	// 	}
	// 	return result.length > 1 ? Sequence(...result) : result[0];
	// }
	//
	// // Figure out the type of expression in the string
	// let indexOfSpace = expressionString.indexOf(' ');
	// if (indexOfSpace !== -1) {
	// 	if (expressionString.charAt(indexOfSpace + 1) === '/') {
	// 		return OrderedChoice(
	// 			...expressionString.split(' / ')
	// 				// .map(choice => choice.trim())
	// 				.map(choice => buildExpression(choice))
	// 		);
	// 	}
	// 	else {
	// 		return Sequence(
	// 			...expressionString.split(' ')
	// 				.map(part => buildExpression(part))
	// 		);
	// 	}
	// }
	// else if (expressionString.endsWith('*')) {
	// 	return ZeroOrMore(expressionString.slice(0, -1));
	// }
	// else if (expressionString.endsWith('+')) {
	// 	return OneOrMore(expressionString.slice(0, -1));
	// }
	// else if (expressionString.endsWith('?')) {
	// 	return Optional(expressionString.slice(0, -1));
	// }
	// // Name or regular expression
	// else {
	// 	return expressionString;
	// }
}

/**
 * For a block starting with an opening bracket, find the index of the end of
 * that block, which could be the closing bracket, or any expression syntax
 * immediately after.
 * 
 * @param {String} string
 * @param {Number} blockStartIndex
 * @return {Number} The index of the end of a bracketed block.
 */
export function findBlockEnd(string, blockStartIndex) {
	let depth = 0;
	for (let i = blockStartIndex; i < string.length; i++) {
		let char = string.charAt(i);
		if (char === '(') {
			depth++;
		}
		else if (char === ')') {
			depth--;
		}
		else if (char === ' ' && depth === 0) {
			return i;
		}
	}
	throw new Error(`Unbalanced brackets in string: "${string}"`);
}
