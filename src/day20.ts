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

/**
 * Perform breadth-first search to populate distances from start
 */
const doBfs = (maze: Readonly<string[][]>): number[][] => {
  const startY = maze.findIndex((row) => row.includes('S'));
  const startX = maze[startY].indexOf('S');

  const grid = maze.map((row) =>
    row.map((cell) => (cell === '#' ? -1 : Infinity))
  );

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
      if (grid[ay]?.[ax] === -1 || grid[ay]?.[ax] < currentValue + 1) {
        continue;
      }

      grid[ay][ax] = currentValue + 1;
      queue.push([ax, ay]);
    }
  }

  return grid;
};

/**
 * Determine number of savings above a threshold, given a maximum cheating distance
 */
const determineSavings = (
  distanceGrid: Readonly<number[][]>,
  maxCheatDistance: number = 2,
  minThreshold: number = 100
): number => {
  let sum = 0;

  for (let y1 = 1; y1 < distanceGrid.length - 1; ++y1) {
    for (let x1 = 1; x1 < distanceGrid[y1].length - 1; ++x1) {
      if (distanceGrid[y1][x1] === -1) {
        continue;
      }

      for (let y2 = 1; y2 < distanceGrid.length - 1; ++y2) {
        for (let x2 = 1; x2 < distanceGrid[y2].length - 1; ++x2) {
          const distance = Math.abs(y2 - y1) + Math.abs(x2 - x1);

          if (
            distance <= maxCheatDistance &&
            distanceGrid[y2][x2] - distanceGrid[y1][x1] - distance >=
              minThreshold
          ) {
            ++sum;
          }
        }
      }
    }
  }

  return sum;
};

const distances: Readonly<number[][]> = doBfs(data);

export const part1 = determineSavings(distances);
export const part2 = determineSavings(distances, 20);

console.log({ part1, part2 });
