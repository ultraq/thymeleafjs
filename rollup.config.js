
import babel       from '@rollup/plugin-babel';
import commonjs    from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace     from '@rollup/plugin-replace';

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
		babel({
			babelHelpers: 'bundled', // Have opted for bundled as it still duplicates things in runtime mode
			skipPreflightCheck: true // See: https://github.com/rollup/plugins/issues/381#issuecomment-627215009
		}),
		commonjs(),
		nodeResolve(),
		replace({
			ENVIRONMENT: JSON.stringify(ENVIRONMENT)
		})
	],
	external: [
		/@babel\/runtime/,
		'@ultraq/array-utils',
		'@ultraq/dom-utils',
		'@ultraq/string-utils',
		'dumb-query-selector',
		'fs',
		'jsdom'
	],
	treeshake: {
		moduleSideEffects: false
	}
};
