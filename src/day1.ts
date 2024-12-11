import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 1;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n').map((line) => line.split('   ').map(Number));

const firsts = data.map((d) => d[0]).sort((a, b) => a - b);
const seconds = data.map((d) => d[1]).sort((a, b) => a - b);

export const part1 = firsts.reduce(
  (sum, x, i) => sum + Math.abs(x - seconds[i])
);
export const part2 = firsts.reduce(
  (sum, x) => sum + x * seconds.filter((q) => q === x).length
);

console.log({ part1, part2 });
