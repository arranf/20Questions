const CodeGenerator = require('../../src/utils/code-generator');

describe('Code Generator Class', () => {
  it('Generates alphanumeric codes of string of length 7 by default', () => {
    const generator = new CodeGenerator();
    const result = generator.generate();
    // regex is: one or more of (digit or a character in range a-z/A-Z) 
    expect(result).toEqual(expect.any(String));
    expect(result).toHaveLength(7);
    expect(result).toMatch(/(\d|[A-Za-z])+/);
  });

  it('Generates codes of arbitary length', () => {
    const generator = new CodeGenerator(12);
    const result = generator.generate();
    expect(result).toHaveLength(12);
  });

  it('Generates codes only with a given set of characters', () => {
    const generator = new CodeGenerator(7, ['a']);
    const result = generator.generate();
    expect(result).toEqual('aaaaaaa');
  });
});