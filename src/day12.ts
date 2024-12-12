import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type Coordinate = [number, number];
type CellSet = Coordinate[];

const AOC_DAY = 12;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data: (string | null)[][] = rawData
  .split('\n')
  .map((row) => row.split(''));

/**
 * Breadth-first search to determine all cells of a region
 */
const search = (
  x: number,
  y: number,
  plant: string,
  acc: CellSet = []
): CellSet => {
  if (data[y]?.[x] !== plant) {
    return acc;
  }

  data[y][x] = null;
  acc.push([x, y]);

  search(x + 1, y, plant, acc);
  search(x - 1, y, plant, acc);
  search(x, y + 1, plant, acc);
  search(x, y - 1, plant, acc);

  return acc;
};

/**
 * Check if a cell has a top fence within a region (set of cells)
 */
const hasTopFence = ([x, y]: Coordinate, cells: CellSet): boolean =>
  !cells.some(([cx, cy]) => cx === x && cy === y - 1);

/**
 * Check if a cell has a bottom fence within a region (set of cells)
 */
const hasBottomFence = ([x, y]: Coordinate, cells: CellSet): boolean =>
  !cells.some(([cx, cy]) => cx === x && cy === y + 1);

/**
 * Check if a cell has a left fence within a region (set of cells)
 */
const hasLeftFence = ([x, y]: Coordinate, cells: CellSet): boolean =>
  !cells.some(([cx, cy]) => cx === x - 1 && cy === y);

/**
 * Check if a cell has a right fence within a region (set of cells)
 */
const hasRightFence = ([x, y]: Coordinate, cells: CellSet): boolean =>
  !cells.some(([cx, cy]) => cx === x + 1 && cy === y);

/**
 * Get perimeter of cell set
 */
const getPerimeter = (cells: CellSet): number =>
  cells.reduce(
    (sum, cell) =>
      sum +
      Number(hasTopFence(cell, cells)) +
      Number(hasBottomFence(cell, cells)) +
      Number(hasLeftFence(cell, cells)) +
      Number(hasRightFence(cell, cells)),
    0
  );

/**
 * Get number of sides of cell set
 */
const getSides = (cells: CellSet): number => {
  const sides: Record<string, Record<number, Set<number>>> = {
    lefts: {},
    rights: {},
    tops: {},
    bottoms: {},
  };

  for (const [x, y] of cells) {
    if (hasTopFence([x, y], cells)) {
      sides.tops[y] ??= new Set();
      sides.tops[y].add(x);
    }

    if (hasBottomFence([x, y], cells)) {
      sides.bottoms[y + 1] ??= new Set();
      sides.bottoms[y + 1].add(x);
    }

    if (hasLeftFence([x, y], cells)) {
      sides.lefts[x] ??= new Set();
      sides.lefts[x].add(y);
    }

    if (hasRightFence([x, y], cells)) {
      sides.rights[x + 1] ??= new Set();
      sides.rights[x + 1].add(y);
    }
  }

  let result = 0;

  for (const orientations of Object.values(sides)) {
    for (const positions of Object.values(orientations)) {
      ++result;

      if (positions.size < 2) {
        continue;
      }

      const sortedPositions = [...positions].sort((a, b) => a - b);

      for (let i = 1; i < sortedPositions.length; ++i) {
        if (sortedPositions[i] - sortedPositions[i - 1] > 1) {
          ++result;
        }
      }
    }
  }

  return result;
};

const regions = [];

do {
  const y = data.findIndex((row) => row.some((cell) => cell !== null));
  const x = data[y].findIndex((cell) => cell !== null);
  const plant = data[y][x] as string;
  const cells = search(x, y, plant);

  regions.push({
    plant,
    cells,
    area: cells.length,
    perimeter: getPerimeter(cells),
    sides: getSides(cells),
  });
} while (data.some((row) => row.some((cell) => cell !== null)));

export const part1 = regions.reduce(
  (sum, region) => sum + region.area * region.perimeter,
  0
);

export const part2 = regions.reduce(
  (sum, region) => sum + region.area * region.sides,
  0
);

console.log({ part1, part2 });
