/*jshint esversion: 6 */

import packageJson from './package.json';

import babel from 'rollup-plugin-babel';
import banner from 'rollup-plugin-banner';
import cjs from '@rollup/plugin-commonjs';
import coffee from 'rollup-plugin-coffee-script';
import copy from 'rollup-plugin-copy';
import del from 'rollup-plugin-delete';
import { terser } from 'rollup-plugin-terser';


const packageName = packageJson.name;
const resolveExt = ['.coffee', '.litcoffee', '.mjs', 'js'];
// #todo: not sure how to use tab as indentation in all codes
const indent = '  '; // '  ' or '\t'
const commonPlugins = [
	coffee(),
	cjs({ extensions: resolveExt }),
	babel({
		babelrc: false,
		presets: ['@babel/env'],
		exclude: 'node_modules/**',
		extensions: resolveExt
	}),
	banner({ file: 'src/index.head.txt' })
];
const pluginsMinify = Array.from(commonPlugins);
pluginsMinify.push(
	terser({ mangle: { reserved: [packageName] } })
);


export default [
	{
		// Clean up and copy files
		input: 'src/test/shared/rollup-other-tasks.js',
		plugins: [
			del({ targets: ['bundles/*', 'test/*'] }),
			copy({ targets: [
				{ src: 'src/test/browser/index.html', dest: 'test/browser/' }
			]})
		]
	}, {
		// Build bundles:
		input: 'src/index.coffee',
		output: [
			{
				// UMD; Bundle in one file; Not minified
				file: `bundles/${packageName}.umd.js`,
				format: 'umd',
				name: packageName,
				indent: indent
			}, {
				// ESM; Bundle in one file; Not minified
				file: `bundles/${packageName}.esm.js`,
				format: 'esm',
				name: packageName,
				indent: indent
			}
		],
		plugins: commonPlugins
	}, {
		// Build bundles:
		input: 'src/index.coffee',
		output: [
			{
				// UMD; Bundles in one file; Minified
				file: `bundles/${packageName}.umd.min.js`,
				format: 'umd',
				name: packageName,
				indent: indent
			}, {
				// ESM; Bundles in one file; Minified
				file: `bundles/${packageName}.esm.min.js`,
				format: 'esm',
				name: packageName,
				indent: indent
			}
		],
		plugins: pluginsMinify
	}, {
		// Build bundled UMD for test in browser
		input: 'src/index.coffee',
		output: {
			file: `test/browser/${packageName}.umd.js`,
			format: 'umd',
			name: packageName,
			indent: indent
		},
		plugins: commonPlugins
	}, {
		// UMD test file
		input: 'src/test/umd/test.coffee',
		output: {
			file: 'test/umd/test.js',
			format: 'umd',
			name: 'test',
			indent: indent
		},
		plugins: commonPlugins
	}, {
		// Browser test file
		input: 'src/test/browser/test.coffee',
		output: {
			file: 'test/browser/test.js',
			format: 'iife',
			name: 'test',
			indent: indent
		},
		plugins: commonPlugins
	}
];
