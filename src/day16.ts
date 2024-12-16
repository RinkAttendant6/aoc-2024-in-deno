import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type Direction = 'N' | 'E' | 'S' | 'W';

const AOC_DAY = 16;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData
  .trim()
  .split('\n')
  .map((x) => x.split(''));

const height = data.length;
const width = data[0].length;

const ty = data.findIndex((row) => row.includes('E'));
const tx = data[ty].indexOf('E');

const pointsMap = Array(height)
  .fill(undefined)
  .map((_, i) =>
    Array(width)
      .fill(undefined)
      .map((_, j) => (data[i][j] === '#' ? -1 : Infinity))
  );

const dfs = (
  x: number,
  y: number,
  direction: Direction,
  points: number = 0
): void => {
  if (x < 0 || y < 0 || x > width || y >= height || points > pointsMap[y][x]) {
    // out of bounds, is a wall, or was already visited through shorter path
    return;
  }

  pointsMap[y][x] = points;

  if (y === ty && x == tx) {
    // found the end
    return;
  }

  switch (direction) {
    case 'N':
      dfs(x, y - 1, 'N', points + 1);
      dfs(x + 1, y, 'E', points + 1001);
      dfs(x - 1, y, 'W', points + 1001);
      break;
    case 'E':
      dfs(x + 1, y, 'E', points + 1);
      dfs(x, y - 1, 'N', points + 1001);
      dfs(x, y + 1, 'S', points + 1001);
      break;
    case 'S':
      dfs(x, y + 1, 'S', points + 1);
      dfs(x + 1, y, 'E', points + 1001);
      dfs(x - 1, y, 'W', points + 1001);
      break;
    case 'W':
      dfs(x - 1, y, 'W', points + 1);
      dfs(x, y - 1, 'N', points + 1001);
      dfs(x, y + 1, 'S', points + 1001);
      break;
  }
};

const y = data.findIndex((row) => row.includes('S'));
const x = data[y].indexOf('S');

dfs(x, y, 'E');

export const part1 = pointsMap[ty][tx];

console.log({ part1 });
