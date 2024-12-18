import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 18;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data: Coordinate[] = rawData
  .trim()
  .split('\n')
  .map((line) => line.split(',').map(Number) as Coordinate);

type Coordinate = [number, number];

/**
 * Create a grid
 */
const createGrid = (
  height: number,
  width: number,
  coords: Coordinate[]
): number[][] => {
  const grid: number[][] = new Array(height + 1)
    .fill(undefined)
    .map((_) => new Array(width + 1).fill(Infinity));

  for (const [x, y] of coords) {
    grid[y][x] = -1;
  }

  return grid;
};

/**
 * Find shortest path for all reachable cells
 */
const search = (grid: number[][], [rx, ry]: Coordinate): number[][] => {
  const queue: Coordinate[] = [[rx, ry]];
  grid[ry][rx] = 0;

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const neighbours: Coordinate[] = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1],
    ];

    for (const [ax, ay] of neighbours) {
      if (ax < 0 || ay < 0 || ay >= grid.length || ax >= grid[0].length) {
        // Out of bounds
        continue;
      }

      if (grid[ay][ax] > grid[y][x] + 1) {
        grid[ay][ax] = grid[y][x] + 1;
        queue.push([ax, ay]);
      }
    }
  }

  return grid;
};

/**
 * Solve part 1
 */
export const solve1 = (maxY = 70, maxX = 70, steps = 1024): number => {
  const start: Coordinate = [0, 0];
  const grid = createGrid(maxY, maxX, data.slice(0, steps));

  return search(grid, start)[maxY][maxX];
};

/**
 * Solve part 2
 */
export const solve2 = (
  maxY = 70,
  maxX = 70,
  startStep = 1024
): Coordinate | null => {
  const start: Coordinate = [0, 0];

  for (let i = startStep; i < data.length; i++) {
    const grid = createGrid(maxY, maxX, data.slice(0, i));
    const destinationSteps = search(grid, start)[maxY][maxX];

    if (destinationSteps === Infinity) {
      return data[i - 1];
    }
  }

  return null;
};

export const part1 = solve1();
export const part2 = solve2();

console.log({ part1, part2 });
