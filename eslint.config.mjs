import cfg from '@neovici/cfg/eslint/index.mjs';

export default [
	...cfg,
	{
		files: ['test/**/*.js'],
		rules: {
			'mocha/max-top-level-suites': 'off',
		},
	},
	{ ignores: ['coverage/**'] },
];
