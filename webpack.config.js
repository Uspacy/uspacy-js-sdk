require('dotenv').config();
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = (_, argv) => {
	const isDev = argv.mode === 'development';
	return {
		entry: {
			index: path.resolve(__dirname, 'src', 'index.ts'),
		},
		output: {
			filename: '[name].js',
			path: path.resolve(__dirname, 'lib'),
			libraryTarget: 'commonjs2',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
				},
			],
		},
		resolve: {
			extensions: ['.tsx', '.ts', '.js', '.jsx'],
			alias: {
				tsyringe: require.resolve('tsyringe/dist/esm2015/index.js'),
			},
		},
		devtool: 'source-map',
		plugins: [
			new Dotenv(),
			...(isDev
				? [
						new ESLintPlugin({
							files: ['./src'],
							extensions: ['tsx', 'ts', 'jsx', 'js'],
							overrideConfigFile: path.resolve(__dirname, '.eslintrc.js'),
						}),
				  ]
				: []),
		],
	};
};
