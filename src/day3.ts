import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 3;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const data = (await fs.readFile(inputPath, 'utf-8')).trim();

const multiply = (str: string) =>
  str
    .match(/(?<=mul\()\d+,\d+(?=\))/g)
    ?.map((c) => c.split(',').map(Number))
    .reduce((sum, [x, y]) => sum + x * y, 0) ?? 0;

export const part1 = multiply(data);

const [first, ...rem] = data.split(`don't()`);

export const part2 = [first, ...rem.map((s) => s.slice(s.indexOf('do()')))]
  .map(multiply)
  .reduce((sum, x) => sum + x);

console.log({ part1, part2 });
