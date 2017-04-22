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
'use strict';

const Dialect                         = require('../dialects/Dialect');
const StandardIfAttributeProcessor    = require('./processors/StandardIfAttributeProcessor');
const StandardTextAttributeProcessor  = require('./processors/StandardTextAttributeProcessor');
const StandardUTextAttributeProcessor = require('./processors/StandardUTextAttributeProcessor');

const NAME   = 'Standard';
const PREFIX = 'th';

/**
 * The out-of-the-box dialect for Thymeleaf, the "Standard Dialect".
 * 
 * @author Emanuel Rabina
 */
class StandardDialect extends Dialect {

	/**
	 * Create an instance of this dialect with the default name (Standard) and
	 * prefix (th).
	 */
	constructor() {

		super(NAME, PREFIX);
	}

	/**
	 * Returns the supported standard processors.
	 * 
	 * @return {Array} A list of the processors included in this dialect.
	 */
	get processors() {

		return [
			new StandardIfAttributeProcessor(),
			new StandardTextAttributeProcessor(),
			new StandardUTextAttributeProcessor()
		];
	}
}

StandardDialect.NAME   = NAME;
StandardDialect.PREFIX = PREFIX;

module.exports = StandardDialect;
