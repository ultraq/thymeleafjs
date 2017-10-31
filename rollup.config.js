
import babel       from 'rollup-plugin-babel';
import commonjs    from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import replace     from 'rollup-plugin-replace';

const {ENVIRONMENT} = process.env;

export default {
	input: 'src/Thymeleaf.js',
	output: [
		{
			file: `lib/thymeleaf.${ENVIRONMENT}.cjs.js`,
			format: 'cjs'
		},
		{
			file: `lib/thymeleaf.${ENVIRONMENT}.es.js`,
			format: 'es'
		}
	],
	plugins: [
		babel(),
		commonjs(),
		nodeResolve({
			jsnext: true
		}),
		replace({
			ENVIRONMENT: JSON.stringify(ENVIRONMENT)
		})
	],
	sourcemap: true
};
