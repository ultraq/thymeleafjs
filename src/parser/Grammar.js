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
 * A collection of Rules that describes a language.
 * 
 * @author Emanuel Rabina
 */
export default class Grammar {

	/**
	 * @param {String} name
	 * @param {Rule} startingRule
	 * @param {...Rule} additionalRules
	 */
	constructor(name, startingRule, ...additionalRules) {

		this.name = name;
		this.rules = [].concat(startingRule, additionalRules);
	}

	/**
	 * Given an input string and a parser, return whether or not the input is
	 * accepted by this grammar.
	 * 
	 * @param {InputBuffer} input
	 * @param {Parser} parser
	 * @return {Object} If the input is accepted, this will be the non-null result
	 *   of matching against the rules of this grammar.
	 */
	accept(input, parser) {

		return this.startingRule.accept(input, parser);
	}

	/**
	 * Return the rule that has the given name.
	 * 
	 * @param {String} name
	 * @return {Rule}
	 */
	findRuleByName(name) {

		let rule = this.rules.find(rule => rule.name === name);
		if (!rule) {
			throw new Error(`Failed to find a rule named "${name}" in the grammar`);
		}
		return rule;
	}

	/**
	 * Returns the grammar's starting rule.
	 * 
	 * @return {Rule}
	 */
	get startingRule() {

		return this.rules[0];
	}
}
