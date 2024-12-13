import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 13;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n\n');

export const part1 = data.reduce((tokens, machine) => {
  const [ax, ay, bx, by, px, py] = machine
    .matchAll(/\d+/g)
    .map((match) => Number(match[0]));

  for (let a = 0; a < 100; ++a) {
    for (let b = 100; b >= 0; --b) {
      if (a * ax + b * bx === px && a * ay + b * by === py) {
        // solution found, add to total tokens
        return tokens + (3 * a + b);
      }
    }
  }

  // did not find solution
  return tokens;
}, 0);

console.log({ part1 });
