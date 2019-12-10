
import babel       from 'rollup-plugin-babel';
import commonjs    from 'rollup-plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace     from 'rollup-plugin-replace';
import {terser}    from 'rollup-plugin-terser';

export default {
	input: 'source/Thymeleaf.js',
	output: {
		file: 'dist/thymeleaf.min.js',
		format: 'iife',
		name: 'Thymeleaf',
		sourcemap: true
	},
	plugins: [
		babel({
			runtimeHelpers: true
		}),
		commonjs({
			namedExports: {
				'dumb-query-selector': ['$', '$$']
			}
		}),
		nodeResolve(),
		replace({
			ENVIRONMENT: JSON.stringify('browser')
		}),
		terser()
	]
};
