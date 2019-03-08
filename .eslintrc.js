module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true,
        commonjs: true,
        amd: true,
        jquery: true,
    },
    extends: 'eslint:recommended',
    parser: 'babel-eslint',
    rules: {
        indent: ['warn', 4],
        quotes: ['warn', 'single'],
        eqeqeq: 'warn',
        semi: ['warn', 'always'],

        'comma-dangle': ['warn', 'always-multiline'],
        'no-cond-assign': ['error', "always"],
        'no-unused-vars': 'warn',

        'no-console': 'off',

        /**
        *** ADDITIONAL
        **/

        'brace-style': ['warn', '1tbs', { allowSingleLine: true }],
        'keyword-spacing': ['warn', { before: true, after: true }],
        'comma-spacing': 'warn',
        'arrow-spacing': ['warn', { before: true, after: true }],
        'space-before-blocks': ['warn', 'always'],
        'space-infix-ops': ['warn'],

        curly: ['warn', 'all'],
        camelcase: 'warn',
        'comma-style': 'warn',
        'semi-style': ['warn', 'last'],
        'semi-spacing': 'warn',
        'no-magic-numbers': 'warn',
        'consistent-this': ['warn', 'self'],
    },
};