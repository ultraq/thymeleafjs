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

import Grammar from '../../source/parser/Grammar';
import Rule    from '../../source/parser/Rule';

/**
 * Tests for the Grammar to describe a language.
 */
describe('parser/Grammar', function() {

	test('#findRuleByName', function() {
		let randomRule = new Rule('RandomRule', /Hello/);
		let grammar = new Grammar('Test',
			new Rule('StartingRule', /Start/),
			randomRule
		);
		expect(grammar.findRuleByName('RandomRule')).toBe(randomRule);
	});

	test('#startingRule', function() {
		let startingRule = new Rule('StartingRule', /Hi/);
		let grammar = new Grammar('Test', startingRule);
		expect(grammar.startingRule).toBe(startingRule);
	});

});
