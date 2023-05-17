module.exports = {
	root: true,
	env : {
		es6 : true,
		node: true
	},
	parserOptions: {
		ecmaVersion: 2021,
		sourceType : 'module'
	},
	plugins: ['align-assignments', 'align-import'],
	rules  : {
		'align-assignments/align-assignments': 'error',
		'align-import/align-import'          : 'error',
		curly                                : ['error', 'multi-or-nest'],
		'comma-dangle'                       : ['error', 'never'],
		indent                               : [
			'error',
			'tab',
			{
				VariableDeclarator: 1,
				ObjectExpression  : 'first',
				ArrayExpression   : 'first',
				ImportDeclaration : 'first',
				SwitchCase        : 1,
				ignoredNodes      : ['TemplateLiteral *']
			}
		],
		'no-tabs'        : 'off',
		quotes           : ['error', 'single'],
		semi             : ['error', 'never'],
		'key-spacing'    : ['error', { align: 'colon' }],
		'no-console'     : process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-debugger'    : process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'no-labels'      : 'off',
		'no-multi-spaces': [
			'error',
			{
				exceptions: {
					AssignmentExpression: true,
					ImportDeclaration   : true,
					Property            : true,
					VariableDeclarator  : true
				}
			}
		],
		'no-extra-boolean-cast'      : 'off',
		'space-before-function-paren': [
			'error',
			{
				anonymous : 'never',
				named     : 'always',
				asyncArrow: 'always'
			}
		]
	}
}
