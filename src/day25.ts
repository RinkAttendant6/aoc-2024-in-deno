import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 25;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n\n');

/**
 * Transpose an array
 */
const transpose = <T>(arr: T[][]): T[][] =>
  arr[0].map((_, i) => arr.map((row) => row[i]));

const keys = data
  .filter((grid) => grid.startsWith('.....'))
  .map((grid) =>
    transpose(
      grid
        .split('\n')
        .slice(1)
        .map((row) => row.split(''))
    ).map((row) => row.filter((c) => c === '#').length - 1)
  );

const locks = data
  .filter((grid) => grid.startsWith('#####'))
  .map((grid) =>
    transpose(
      grid
        .split('\n')
        .slice(1)
        .map((row) => row.split(''))
    ).map((row) => row.filter((c) => c === '#').length)
  );

export let part1 = 0;

for (const key of keys) {
  for (const lock of locks) {
    if (key.every((pin, idx) => pin + lock[idx] <= 5)) {
      ++part1;
    }
  }
}

console.log({ part1 });
