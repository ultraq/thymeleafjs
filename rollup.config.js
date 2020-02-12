
import nodeResolve from '@rollup/plugin-node-resolve';
import babel       from 'rollup-plugin-babel';
import commonjs    from 'rollup-plugin-commonjs';
import replace     from 'rollup-plugin-replace';

const {ENVIRONMENT} = process.env;

export default {
	input: 'source/Thymeleaf.js',
	output: [
		{
			file: `lib/thymeleaf.${ENVIRONMENT}.cjs.js`,
			format: 'cjs',
			sourcemap: true
		},
		{
			file: `lib/thymeleaf.${ENVIRONMENT}.es.js`,
			format: 'es',
			sourcemap: true
		}
	],
	plugins: [
		babel(),
		commonjs({
			namedExports: {
				'dumb-query-selector': ['$', '$$']
			}
		}),
		nodeResolve(),
		replace({
			ENVIRONMENT: JSON.stringify(ENVIRONMENT)
		})
	],
	external: [
		'@ultraq/array-utils',
		'@ultraq/string-utils',
		'dumb-query-selector',
		'jsdom'
	]
};
