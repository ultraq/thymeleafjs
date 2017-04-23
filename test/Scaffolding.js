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
'use strict'; // eslint-disable-line strict

/* 
 * Invoke the babel compiler to run over any source, tests, and any known ES6
 * dependencies.  Let's me use ES6 module syntax (`import`/`export`) in test
 * scripts, but doesn't work on this one.
 */
require('babel-register')({
	only: [
		'/src',
		'/test',
		'/lodash-es'
	]
});

/* 
 * Set up JSDOM to mock a DOM/browser environment
 */
const {jsdom} = require('jsdom');

const DEFAULT_HTML = `
<html>
<body>
	<div id="test-sandbox"></div>
</body>
</html>`;

/* global global, document */
global.document = jsdom(DEFAULT_HTML);
global.window = document.defaultView;
