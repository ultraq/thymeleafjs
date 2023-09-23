
import babel       from '@rollup/plugin-babel';
import commonjs    from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace     from '@rollup/plugin-replace';
import terser      from '@rollup/plugin-terser';

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
			babelHelpers: 'bundled',
			skipPreflightCheck: true // See: https://github.com/rollup/plugins/issues/381#issuecomment-627215009
		}),
		commonjs(),
		nodeResolve({
			browser: true
		}),
		replace({
			ENVIRONMENT: JSON.stringify('browser')
		}),
		terser()
	],
	// These items don't end up in the browser build, but because they're
	// `import`ed, we need to tell rollup to ignore them.
	external: [
		'fs',
		'jsdom'
	],
	treeshake: {
		moduleSideEffects: false
	}
};
