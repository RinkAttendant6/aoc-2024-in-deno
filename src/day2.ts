import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 2;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n').map((line) => line.split(' ').map(Number));

const isSafe = (row: number[]) => {
  const incr = row[1] > row[0];

  for (let i = 1; i < row.length; ++i) {
    const a = row[i],
      b = row[i - 1];
    if (a === b || Math.abs(a - b) > 3 || (a < b && incr) || (a > b && !incr))
      return false;
  }

  return true;
};

export const part1 = data.filter((r) => isSafe(r)).length;
export const part2 = data.filter(
  (r) => isSafe(r) || r.some((_, i) => isSafe(r.toSpliced(i, 1)))
).length;

console.log({ part1, part2 });
