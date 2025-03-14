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
    // Enforce commit type is in lower-case.
    'type-case': [2, 'always', 'lower-case'],
    // Enforce that the subject follows sentence case.
    'subject-case': [2, 'always', 'sentence-case'],
    // Limit commit header length to 72 characters.
    'header-max-length': [2, 'always', 72],
    // Enforce that subject is not empty.
    'subject-empty': [2, 'never'],
    // Enforce that the commit message subject does not end with a full stop.
    'subject-full-stop': [2, 'never', '.'],
  },
};
