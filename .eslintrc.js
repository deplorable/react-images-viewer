// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    babelOptions: {
      presets: ['@babel/preset-react']
    },
  },
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime'
  ],
  plugins: ['react'],
  // required to lint *.vue files
  // check if imports actually resolve
  settings: {
    react: {
      createClass: 'createReactClass',
      pragma: 'React',
      version: 'detect'
    },
  },
  rules: {
    'no-unused-vars': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': process.env.NODE_ENV === 'production' ? 2 : 0,
    "no-unused-vars": [2, { "vars": "all", "args": "after-used" }],
    'global-require': 0,
    "react/jsx-uses-react": "error",   
    "react/jsx-uses-vars": "error" 
  }
}
