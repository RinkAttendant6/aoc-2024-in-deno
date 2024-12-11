import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 7;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n');

/**
 * Solve recursively
 */
const solve = (
  target: number,
  numbers: number[],
  currentValue: number | null = null,
  concat: boolean = false
): boolean => {
  if (currentValue === null) {
    // initial call - use first number as current value
    [currentValue, ...numbers] = numbers;
  }

  if (numbers.length === 0) {
    return currentValue === target;
  }

  if (currentValue > target) {
    return false;
  }

  const [num, ...remaining] = numbers;

  return (
    solve(target, remaining, currentValue * num, concat) ||
    solve(target, remaining, currentValue + num, concat) ||
    (concat && solve(target, remaining, Number(`${currentValue}${num}`), true))
  );
};

export let part1 = 0;
export let part2 = 0;

console.time();
for (const line of data) {
  const [target, ...numbers] = line.split(/:? /).map(Number);

  part1 += solve(target, numbers) ? target : 0;
  part2 += solve(target, numbers, null, true) ? target : 0;
}
console.timeEnd();

console.log({ part1, part2 });
