import antfu from '@antfu/eslint-config';

export default antfu({
  react: true,
  stylistic: {
    semi: true, // 强制使用分号
    quotes: 'single', // 使用单引号
    indent: 2, // 缩进 2 个空格
  },
  rules: {
    // 原有的关闭规则
    'no-console': ['off'],
    'no-unused-vars': ['off'],
    'sort-imports': ['off'],
    'import/order': ['off'],
    'style/indent': ['off'],
    'no-use-before-define': ['off'],
    'ts/no-use-before-define': ['off'],
    // 根据 prettier 配置添加的格式化规则
    'style/max-len': ['error', {
      code: 200, // printWidth: 120
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],
    'style/quote-props': ['error', 'as-needed'], // quoteProps: 'as-needed'
    'style/jsx-quotes': ['error', 'prefer-double'], // jsxSingleQuote: false
    'style/comma-dangle': ['error', 'always-multiline'], // trailingComma: 'es5' -> 'always-multiline'
    'style/object-curly-spacing': ['error', 'always'], // bracketSpacing: true
    'style/arrow-parens': ['error', 'as-needed'], // arrowParens: 'avoid' -> 'as-needed'
    'style/linebreak-style': ['error', 'unix'], // endOfLine: 'auto' (设为unix比较通用)

    // JSX 相关规则
    'style/jsx-closing-bracket-location': ['error', 'line-aligned'], // jsxBracketSameLine: false
    'style/jsx-indent': ['error', 2],
    'style/jsx-indent-props': ['error', 2],
  },
  ignores: [
    'docs/**',
    'node_modules',
    'node_modules/**',
    '.pnp',
    '.pnp/**',
    '.pnp.js',
    '**/.pnp.js/**',
    '.idea',
    '**/.idea/**',
    'coverage',
    'coverage/**',
    'build',
    'build/**',
    'system',
    'system/**',
    'config',
    'config/**',
    '.DS_Store',
    '**/.DS_Store/**',
    '.env.local',
    '**/.env.local/**',
    '.env.development.local',
    '**/.env.development.local/**',
    '.env.test.local',
    '**/.env.test.local/**',
    '.env.production.local',
    '**/.env.production.local/**',
    'npm-debug.log*',
    '**/npm-debug.log*/**',
    'yarn-debug.log*',
    '**/yarn-debug.log*/**',
    'yarn-error.log*',
    '**/yarn-error.log*/**',
    '**/**/**.md',
  ],
});
