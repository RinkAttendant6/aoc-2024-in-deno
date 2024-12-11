import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 4;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n').map((line) => line.split(''));

/**
 * Search for XMAS in all directions
 */
const search1 = (x: number, y: number) =>
  data[y][x] === 'X'
    ? [
        // right
        data[y][x + 1] + data[y][x + 2] + data[y][x + 3],
        // left
        data[y][x - 1] + data[y][x - 2] + data[y][x - 3],
        // up
        data[y - 1]?.[x] + data[y - 2]?.[x] + data[y - 3]?.[x],
        // down
        data[y + 1]?.[x] + data[y + 2]?.[x] + data[y + 3]?.[x],
        // upLeft
        data[y - 1]?.[x - 1] + data[y - 2]?.[x - 2] + data[y - 3]?.[x - 3],
        // upRight
        data[y - 1]?.[x + 1] + data[y - 2]?.[x + 2] + data[y - 3]?.[x + 3],
        // downRight
        data[y + 1]?.[x + 1] + data[y + 2]?.[x + 2] + data[y + 3]?.[x + 3],
        // downLeft
        data[y + 1]?.[x - 1] + data[y + 2]?.[x - 2] + data[y + 3]?.[x - 3],
      ].filter((str) => str === 'MAS').length
    : 0;

/**
 * Search for X-MAS with right or down pairs of "M"
 */
const search2 = (x: number, y: number) =>
  data[y][x] === 'M'
    ? [
        // down, with right neighbour
        data[y][x + 2] +
          data[y + 1]?.[x + 1] +
          data[y + 2]?.[x] +
          data[y + 2]?.[x + 2],
        // up, with right neighbour
        data[y][x + 2] +
          data[y - 1]?.[x + 1] +
          data[y - 2]?.[x] +
          data[y - 2]?.[x + 2],
        // right, with lower neighbour
        data[y + 2]?.[x] +
          data[y + 1]?.[x + 1] +
          data[y][x + 2] +
          data[y + 2]?.[x + 2],
        // left, with lower neighbour
        data[y + 2]?.[x] +
          data[y + 1]?.[x - 1] +
          data[y][x - 2] +
          data[y + 2]?.[x - 2],
      ].filter((str) => str === 'MASS').length
    : 0;

export let part1 = 0;
export let part2 = 0;

for (let r = 0; r < data.length; ++r) {
  for (let c = 0; c < data[r].length; ++c) {
    part1 += search1(c, r);
    part2 += search2(c, r);
  }
}

console.log({ part1, part2 });
