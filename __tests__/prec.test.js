/**
 * Jest tests for the Jison parser
 * 
 */
const parse = require("../src/parser.js").parse;

describe('Parser Failing Tests', () => {
  test('should handle multiplication and division before addition and subtraction', () => {
    expect(parse("2 + 3 * 4")).toBe(14); // 2 + (3 * 4) = 14
    expect(parse("10 - 6 / 2")).toBe(7); // 10 - (6 / 2) = 7
    expect(parse("5 * 2 + 3")).toBe(13); // (5 * 2) + 3 = 13
    expect(parse("20 / 4 - 2")).toBe(3); // (20 / 4) - 2 = 3
  });
  test('should handle exponentiation with highest precedence', () => {
    expect(parse("2 + 3 ** 2")).toBe(11); // 2 + (3 ** 2) = 11
    expect(parse("2 * 3 ** 2")).toBe(18); // 2 * (3 ** 2) = 18
    expect(parse("10 - 2 ** 3")).toBe(2); // 10 - (2 ** 3) = 2
  });
  test('should handle right associativity for exponentiation', () => {
    expect(parse("2 ** 3 ** 2")).toBe(512); // 2 ** (3 ** 2) = 2 ** 9 = 512
    expect(parse("3 ** 2 ** 2")).toBe(81); // 3 ** (2 ** 2) = 3 ** 4 = 81
  });
  test('should handle mixed operations with correct precedence', () => {
    expect(parse("1 + 2 * 3 - 4")).toBe(3); // 1 + (2 * 3) - 4 = 3
    expect(parse("15 / 3 + 2 * 4")).toBe(13); // (15 / 3) + (2 * 4) = 13
    expect(parse("10 - 3 * 2 + 1")).toBe(5); // 10 - (3 * 2) + 1 = 5
  });
  test('should handle expressions with exponentiation precedence', () => {
    expect(parse("2 ** 3 + 1")).toBe(9); // (2 ** 3) + 1 = 9
    expect(parse("3 + 2 ** 4")).toBe(19); // 3 + (2 ** 4) = 19
    expect(parse("2 * 3 ** 2 + 1")).toBe(19); // 2 * (3 ** 2) + 1 = 19
  });
  test('should handle various realistic calculations with correct precedence', () => {
    expect(parse("1 + 2 * 3")).toBe(7); // 1 + (2 * 3) = 7
    expect(parse("6 / 2 + 4")).toBe(7); // (6 / 2) + 4 = 7
    expect(parse("2 ** 2 + 1")).toBe(5); // (2 ** 2) + 1 = 5
    expect(parse("10 / 2 / 5")).toBe(1); // (10 / 2) / 5 = 1
    expect(parse("100 - 50 + 25")).toBe(75); // (100 - 50) + 25 = 75
    expect(parse("2 * 3 + 4 * 5")).toBe(26); // (2 * 3) + (4 * 5) = 26
  });
});

describe('Float precedence and associativity tests', () => {

  test('should respect precedence with non-integer floats', () => {
    expect(parse("2.5 + 3.2 * 4.1")).toBeCloseTo(15.62); // 2.5 + (3.2 * 4.1) = 2.5 + 13.12 = 15.62

    expect(parse("10.8 - 6.4 / 2.0")).toBeCloseTo(7.6); // 10.8 - (6.4 / 2.0) = 10.8 - 3.2 = 7.6

    expect(parse("5.5 * 2.2 + 3.3")).toBeCloseTo(15.4); // (5.5 * 2.2) + 3.3 = 12.1 + 3.3 = 15.4
  });

  test('should respect exponent precedence with floats', () => {
    expect(parse("2.5 + 3.0 ** 2")).toBeCloseTo(11.5); // 2.5 + (3 ** 2) = 2.5 + 9 = 11.5

    expect(parse("1.5 * 2.0 ** 3")).toBeCloseTo(12); // 1.5 * (2 ** 3) = 1.5 * 8 = 12
  });

  test('should respect right associativity of exponentiation with floats', () => {
    expect(parse("2.0 ** 3.0 ** 1.0")).toBeCloseTo(8); // 2 ** (3 ** 1) = 2 ** 3 = 8

    expect(parse("4.0 ** 1.5 ** 2.0")).toBeCloseTo(4 ** (1.5 ** 2));
  });

  test('should respect left associativity for division and subtraction with floats', () => {
    expect(parse("9.6 / 2.4 / 2.0")).toBeCloseTo(2); // (9.6 / 2.4) / 2 = 4 / 2 = 2

    expect(parse("7.5 - 2.5 - 1.0")).toBeCloseTo(4); // (7.5 - 2.5) - 1 = 5 - 1 = 4
  });

});

describe('Parentheses handling tests', () => {

  test('should override normal precedence with parentheses', () => {
    expect(parse("(2 + 3) * 4")).toBe(20);
    expect(parse("2 * (3 + 4)")).toBe(14);
    expect(parse("(10 - 6) / 2")).toBe(2);
  });

  test('should handle nested parentheses', () => {
    expect(parse("((2 + 3) * 2)")).toBe(10);
    expect(parse("(1 + (2 * 3))")).toBe(7);
    expect(parse("((1 + 2) * (3 + 4))")).toBe(21);
  });

  test('should work with exponentiation inside parentheses', () => {
    expect(parse("(2 + 1) ** 2")).toBe(9);
    expect(parse("2 ** (1 + 2)")).toBe(8);
  });

  test('should work with floats inside parentheses', () => {
    expect(parse("(2.5 + 3.5) * 2")).toBeCloseTo(12);
    expect(parse("2 * (1.5 + 2.5)")).toBeCloseTo(8);
  });

});

describe('Invalid input tests', () => {

  test('should fail on invalid characters', () => {
    expect(() => parse("2 + @")).toThrow();
    expect(() => parse("#")).toThrow();
    expect(() => parse("3 & 4")).toThrow();
  });

  test('should fail on incomplete expressions', () => {
    expect(() => parse("2 +")).toThrow();
    expect(() => parse("* 3")).toThrow();
    expect(() => parse("4 **")).toThrow();
  });

  test('should fail on malformed expressions', () => {
    expect(() => parse("2 + + 3")).toThrow();
    expect(() => parse("3 * / 2")).toThrow();
    expect(() => parse("** 2 3")).toThrow();
  });

  test('should fail on incorrect parentheses', () => {
    expect(() => parse("(2 + 3")).toThrow();
    expect(() => parse("2 + 3)")).toThrow();
    expect(() => parse("((2 + 3)")).toThrow();
  });

  test('should fail on empty input', () => {
    expect(() => parse("")).toThrow();
  });

});