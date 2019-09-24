'use strict'; // eslint-disable-line

module.exports = {
	collectCoverage: true,
	collectCoverageFrom: [
		'source/**/*.js'
	],
	coverageReporters: [
		'html',
		'lcov',
		'text-summary'
	],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	},
	globals: {
		ENVIRONMENT: 'node'
	},
	testMatch: [
		'**/test/**/*.js'
	]
};
