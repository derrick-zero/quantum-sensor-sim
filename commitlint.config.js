module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce specific commit types
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    // Enforce type and subject casing
    'type-case': [2, 'always', 'lower-case'],
    'subject-case': [2, 'always', 'sentence-case'],
    // Limit header length
    'header-max-length': [2, 'always', 72],
    // Enforce subject format
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
  },
};
