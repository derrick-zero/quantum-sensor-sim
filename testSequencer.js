const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
  sort(tests) {
    // Move collision tests to the end
    const collisionBenchmarkTest = tests.find(test =>
      test.path.includes('collisionBenchmark.test.ts')
    );
    const otherTests = tests.filter(
      test => !test.path.includes('collisionBenchmark.test.ts')
    );
    return [...otherTests, collisionBenchmarkTest];
  }
}

module.exports = CustomSequencer;
