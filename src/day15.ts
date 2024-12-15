import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 15;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.trim().split('\n\n');

const map = data[0].split('\n').map((x) => x.split(''));
const movements = data[1].split('');

let y = map.findIndex((row) => row.includes('@'));
let x = map[y].indexOf('@');

for (const direction of movements) {
  const currentRow = map[y];
  const currentCol = map.map((row) => row[x]);

  if (direction === '^') {
    const closestWall = currentCol.lastIndexOf('#', y - 1);
    const closestSpace = currentCol.lastIndexOf('.', y - 1);

    if (closestSpace > closestWall) {
      for (let i = closestSpace; i < y; ++i) {
        map[i][x] = map[i + 1][x];
      }
      map[y][x] = '.';
      --y;
    }
  } else if (direction === 'v') {
    const closestWall = currentCol.indexOf('#', y + 1);
    const closestSpace = currentCol.indexOf('.', y + 1);

    if (closestSpace !== -1 && closestSpace < closestWall) {
      for (let i = closestSpace; i > y; --i) {
        map[i][x] = map[i - 1][x];
      }
      map[y][x] = '.';
      ++y;
    }
  } else if (direction === '<') {
    const closestWall = currentRow.lastIndexOf('#', x - 1);
    const closestSpace = currentRow.lastIndexOf('.', x - 1);

    if (closestSpace > closestWall) {
      map[y].splice(closestSpace, 1);
      map[y].splice(x, 0, '.');
      --x;
    }
  } else if (direction === '>') {
    const closestWall = currentRow.indexOf('#', x + 1);
    const closestSpace = currentRow.indexOf('.', x + 1);

    if (closestSpace !== -1 && closestSpace < closestWall) {
      map[y].splice(closestSpace, 1);
      map[y].splice(x, 0, '.');
      ++x;
    }
  }
}

export const part1 = map.reduce(
  (sum, row, i) =>
    sum +
    row.reduce(
      (sum2, col, j) => (col === 'O' ? sum2 + (100 * i + j) : sum2),
      0
    ),
  0
);

console.log({ part1 });
