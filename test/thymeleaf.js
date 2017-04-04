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
/* eslint-env mocha */
'use strict';

const thymeleaf                     = require('../lib/thymeleaf');
const {areSerializedDocumentsEqual} = require('../lib/utilities/Dom');

const {assert} = require('chai');

const fs   = require('fs');
const path = require('path');

/**
 * Tests for the Thymeleaf processing functions.
 */
describe('Thymeleaf', function() {

	it('Should work', function(done) {
		let templatePath = path.join(__dirname, 'template.html');
		thymeleaf.processFile(templatePath, {
			title: 'Hello!'
		})
			.then(template => {
				let templateFromFile = fs.readFileSync(templatePath).toString();
				assert.isTrue(areSerializedDocumentsEqual(template, templateFromFile));
				done();
			})
			.catch(error => {
				assert.fail();
				done();
			});
	});
});
