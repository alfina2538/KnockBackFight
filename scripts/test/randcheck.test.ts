import { GenerateRandNum, GenerateRandNumArrayNotDuplicate } from "../ts/common";

test("randnum in -5 ~ 10", () => {
  let randNum = GenerateRandNum(-5, 10)
  expect(randNum).toBeLessThanOrEqual(10);
  expect(randNum).toBeGreaterThanOrEqual(-5);
});

test("randnum in -100 ~ 20", () => {
  let randNum = GenerateRandNum(-100, 20);
  expect(randNum).toBeLessThanOrEqual(20);
  expect(randNum).toBeGreaterThanOrEqual(-100);
});

test("randnum in -1 ~ 0", () => {
  let randNum = GenerateRandNum(-1, 0);
  expect(randNum).toBeLessThanOrEqual(0);
  expect(randNum).toBeGreaterThanOrEqual(-1);
});

test("randnum <= -20", () => {
  let randNum = GenerateRandNum(-40, -30);
  expect(randNum).toBeLessThanOrEqual(-20);
});

test("randnum array check length", () => {
  const randNums = GenerateRandNumArrayNotDuplicate(1, 10, 3);
  expect(randNums.length).toBe(3);
});

test("randnum arrat num check", () => {
  const randNums = GenerateRandNumArrayNotDuplicate(1, 10, 10);
  randNums.forEach(randNum => {
    expect(randNum).toBeGreaterThanOrEqual(1);
    expect(randNum).toBeLessThanOrEqual(10);
  });
});

test("randnum empty check", () => {
  const randNums = GenerateRandNumArrayNotDuplicate(1, 10, 100);
  expect(randNums.length).toBe(0);
});
