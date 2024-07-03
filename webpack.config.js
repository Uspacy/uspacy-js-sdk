require('dotenv').config();
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
	source: path.resolve(__dirname, 'src'),
	demo: path.resolve(__dirname, 'src', 'demo'),
};

module.exports = (_, argv) => {
	const isDev = argv.mode === 'development';
	const isDemo = process.env.NODE_ENV === 'demo';
	const index = isDemo ? path.resolve(PATHS.demo, 'index.ts') : path.resolve(PATHS.source, 'index.ts');
	const filename = isDemo ? 'static/[name].js' : '[name].js';
	return {
		entry: {
			index,
		},
		output: {
			filename,
			path: path.resolve(__dirname, 'lib'),
			libraryTarget: isDemo ? undefined : 'commonjs2',
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
		...(isDemo && {
			devServer: {
				static: path.join(__dirname, 'lib'),
				compress: true,
				port: 4000,
				devMiddleware: {
					writeToDisk: true,
				},
				proxy: {
					'/': {
						target: process.env.PROXY_URL,
						secure: false,
						changeOrigin: true,
						bypass: function (req) {
							if (req.url.startsWith('/static')) {
								return req.url;
							}
						},
					},
				},
			},
		}),
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
			...(isDemo
				? [
						new HtmlWebpackPlugin({
							template: path.resolve(PATHS.demo, 'index.html'),
						}),
				  ]
				: []),
		],
	};
};
