import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 20;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData
  .trim()
  .split('\n')
  .map((r) => r.split(''));

const height = data.length;
const width = data[0].length;

const startY = data.findIndex((row) => row.includes('S'));
const startX = data[startY].indexOf('S');

const endY = data.findIndex((row) => row.includes('E'));
const endX = data[endY].indexOf('E');

const emptyDistanceGrid = data.map((row) =>
  row.map((cell) => (cell === '#' ? -1 : Infinity))
);

const doDfs = (grid: number[][]): number[][] => {
  const queue = [[startX, startY]];
  grid[startY][startX] = 0;

  while (queue.length) {
    const [x, y] = queue.shift()!;

    const neighbours = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    ];

    const currentValue = grid[y][x];

    for (const [ax, ay] of neighbours) {
      if (
        ax < 0 ||
        ax >= width ||
        ay < 0 ||
        ay >= height ||
        grid[ay][ax] === -1 ||
        grid[ay][ax] < currentValue + 1
      ) {
        continue;
      }

      grid[ay][ax] = currentValue + 1;
      queue.push([ax, ay]);
    }
  }

  return grid;
};

const baseline = doDfs(structuredClone(emptyDistanceGrid))[endY][endX];

const walls = [];

for (let i = 1; i < data.length - 1; ++i) {
  for (let j = 1; j < data[i].length - 1; ++j) {
    if (data[i][j] === '#') {
      walls.push([j, i]);
    }
  }
}

export let part1 = 0;
for (let i = 0; i < walls.length; ++i) {
  const [x1, y1] = walls[i];

  const adjacentWalls = walls.filter(
    ([x2, y2]) => Math.abs(x1 - x2) < 1 && Math.abs(y1 - y2) < 1
  );

  for (const [x2, y2] of adjacentWalls) {
    const q = structuredClone(emptyDistanceGrid);
    q[y1][x1] = Infinity;
    q[y2][x2] = Infinity;

    const saving = baseline - doDfs(q)[endY][endX];
    if (saving >= 100) {
      ++part1;
    }
  }
}

console.log({ part1 });
