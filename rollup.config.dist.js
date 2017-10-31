
import babel       from 'rollup-plugin-babel';
import commonjs    from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace     from 'rollup-plugin-replace';
import uglify      from 'rollup-plugin-uglify';
import {minify}    from 'uglify-es';

export default {
	input: 'src/Thymeleaf.js',
	output: {
		file: 'dist/thymeleaf.min.js',
		format: 'iife',
		name: 'Thymeleaf'
	},
	plugins: [
		babel(),
		commonjs(),
		nodeResolve({
			jsnext: true
		}),
		replace({
			ENVIRONMENT: JSON.stringify('browser')
		}),
		uglify({}, minify)
	],
	sourcemap: true
};
