/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
	exclude: ['./src/demo/**/*.ts'],
	entryPoints: ['./src/**/*.ts'],
	disableSources: true,
	out: 'docs',
};
