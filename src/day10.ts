import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 10;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n').map((row) => row.split('').map(Number));

const height = data.length;
const width = data[0].length;

/**
 * Search for trails
 * @param x
 * @param y
 * @param needle Value to look for
 * @param accumulator Map of coordinate/count pairs for valid destinations and number of paths
 * @returns {Record<string, number>} Accumulator
 */
const search = (
  x: number,
  y: number,
  needle: number,
  accumulator: Record<string, number> = {}
) => {
  // in bounds and valid value?
  if (x >= 0 && y >= 0 && x < width && y < height && data[y]?.[x] === needle) {
    // still climbing?
    if (needle < 9) {
      search(x + 1, y, needle + 1, accumulator);
      search(x - 1, y, needle + 1, accumulator);
      search(x, y - 1, needle + 1, accumulator);
      search(x, y + 1, needle + 1, accumulator);
    } else {
      const key = `${x} ${y}`;

      accumulator[key] ??= 0;
      ++accumulator[key];
    }
  }

  return accumulator;
};

export let part1 = 0;
export let part2 = 0;

for (let y = 0; y < height; ++y) {
  for (let x = 0; x < width; ++x) {
    if (data[y][x] === 0) {
      const result = search(x, y, data[y][x]);
      part1 += Object.keys(result).length;
      part2 += Object.values(result).reduce((sum, x) => sum + x);
    }
  }
}

console.log({ part1, part2 });
