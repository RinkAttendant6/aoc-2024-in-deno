import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type Coordinates = [number, number];
type WarehouseGrid = ('@' | '.' | '#' | 'O')[][];
type WideWarehouseGrid = ('@' | '.' | '#' | '[' | ']')[][];
type Direction = '^' | 'v' | '<' | '>';

const AOC_DAY = 15;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.trim().split('\n\n');

const map: WarehouseGrid = data[0]
  .split('\n')
  .map((x) => x.split('')) as WarehouseGrid;

const map2: WideWarehouseGrid = data[0]
  .replaceAll('#', '##')
  .replaceAll('O', '[]')
  .replaceAll('.', '..')
  .replaceAll('@', '@.')
  .split('\n')
  .map((x) => x.split('')) as WideWarehouseGrid;

const movements: Direction[] = data[1]
  .replaceAll('\n', '')
  .split('') as Direction[];

/**
 * Produce map visualization
 */
const drawMap = (
  map: WarehouseGrid | WideWarehouseGrid,
  clear: boolean = true
): void => {
  clear && console.log('\x1Bc');
  console.log(
    map
      .map((row) =>
        row
          .join('')
          .replace('@', '\x1b[32m@\x1b[0m')
          .replaceAll('#', '\x1b[31m#\x1b[0m')
          .replaceAll('.', ' ')
      )
      .join('\n')
  );
};

/**
 * Get the starting position of the robot
 */
const getStartingPosition = (
  map: WarehouseGrid | WideWarehouseGrid
): Coordinates => {
  const y = map.findIndex((row) => row.includes('@'));
  const x = map[y].indexOf('@');

  return [x, y];
};

/**
 * Movement functions to solve part 1
 */
const movementFunctions1 = (
  map: WarehouseGrid
): Record<Direction, (arg0: Coordinates) => Coordinates> => ({
  /**
   * Move up
   */
  '^': ([x, y]: Coordinates): Coordinates => {
    const currentCol = map.map((row) => row[x]);
    const closestWall = currentCol.lastIndexOf('#', y - 1);
    const closestSpace = currentCol.lastIndexOf('.', y - 1);

    if (closestSpace < closestWall) {
      return [x, y];
    }

    for (let i = closestSpace; i < y; ++i) {
      map[i][x] = map[i + 1][x];
    }
    map[y][x] = '.';

    return [x, y - 1];
  },

  /**
   * Move down
   */
  v: ([x, y]: Coordinates): Coordinates => {
    const currentCol = map.map((row) => row[x]);
    const closestWall = currentCol.indexOf('#', y + 1);
    const closestSpace = currentCol.indexOf('.', y + 1);

    if (closestSpace < 0 || closestSpace > closestWall) {
      return [x, y];
    }

    for (let i = closestSpace; i > y; --i) {
      map[i][x] = map[i - 1][x];
    }
    map[y][x] = '.';

    return [x, y + 1];
  },

  /**
   * Move left
   */
  '<': ([x, y]: Coordinates): Coordinates => {
    const closestWall = map[y].lastIndexOf('#', x - 1);
    const closestSpace = map[y].lastIndexOf('.', x - 1);

    if (closestSpace < closestWall) {
      return [x, y];
    }

    map[y].splice(closestSpace, 1);
    map[y].splice(x, 0, '.');

    return [x - 1, y];
  },

  /**
   * Move right
   */
  '>': ([x, y]: Coordinates): Coordinates => {
    const closestWall = map[y].indexOf('#', x + 1);
    const closestSpace = map[y].indexOf('.', x + 1);

    if (closestSpace < 0 || closestSpace > closestWall) {
      return [x, y];
    }

    map[y].splice(closestSpace, 1);
    map[y].splice(x, 0, '.');

    return [x + 1, y];
  },
});

/**
 * Movement functions to solve part 2
 */
const movementFunctions2 = (
  map: WideWarehouseGrid
): Record<Direction, (arg0: Coordinates) => Coordinates> => ({
  /**
   * Move up
   */
  '^': ([x, y]: Coordinates): Coordinates => {
    const charAboveRobot = map[y - 1][x];

    if (charAboveRobot === '#') {
      // can't move
      return [x, y];
    }

    if (charAboveRobot === '.') {
      // nothing above, just move
      map[y - 1][x] = '@';
      map[y][x] = '.';
      return [x, y - 1];
    }

    let doNotMove = false;

    let boxesToMove = [
      `${x} ${y - 1}`,
      `${charAboveRobot === '[' ? x + 1 : x - 1} ${y - 1}`,
    ];

    for (let c = 0; c < boxesToMove.length; ++c) {
      const [cx, cy] = boxesToMove[c].split(' ').map(Number);
      const charAbove = map[cy - 1][cx];

      doNotMove ||= charAbove === '#';

      if (charAbove === '[') {
        boxesToMove.push(`${cx} ${cy - 1}`, `${cx + 1} ${cy - 1}`);
      } else if (charAbove === ']') {
        boxesToMove.push(`${cx - 1} ${cy - 1}`, `${cx} ${cy - 1}`);
      }

      boxesToMove = [...new Set(boxesToMove)];
    }

    if (doNotMove) {
      return [x, y];
    }

    // start moving from top to bottom
    boxesToMove
      .sort((a, b) => {
        const [ax, ay] = a.split(' ').map(Number);
        const [bx, by] = b.split(' ').map(Number);
        return ay - by || ax - bx;
      })
      .forEach((coords) => {
        const [cx, cy] = coords.split(' ').map(Number);
        map[cy - 1][cx] = map[cy][cx];
        map[cy][cx] = '.';
      });

    map[y][x] = '.';

    return [x, y - 1];
  },

  /**
   * Move down
   */
  v: ([x, y]: Coordinates): Coordinates => {
    const charBelowRobot = map[y + 1][x];

    if (charBelowRobot === '#') {
      // can't move
      return [x, y];
    }

    if (charBelowRobot === '.') {
      // nothing below, just move
      map[y + 1][x] = '@';
      map[y][x] = '.';
      return [x, y + 1];
    }

    let doNotMove = false;

    let boxesToMove = [
      `${x} ${y + 1}`,
      `${charBelowRobot === '[' ? x + 1 : x - 1} ${y + 1}`,
    ];

    for (let c = 0; c < boxesToMove.length; ++c) {
      const [cx, cy] = boxesToMove[c].split(' ').map(Number);
      const charBelow = map[cy + 1][cx];

      doNotMove ||= charBelow === '#';

      if (charBelow === '[') {
        boxesToMove.push(`${cx} ${cy + 1}`, `${cx + 1} ${cy + 1}`);
      } else if (charBelow === ']') {
        boxesToMove.push(`${cx - 1} ${cy + 1}`, `${cx} ${cy + 1}`);
      }

      boxesToMove = [...new Set(boxesToMove)];
    }

    if (doNotMove) {
      return [x, y];
    }

    // start moving from bottom to top
    boxesToMove
      .sort((a, b) => {
        const [ax, ay] = a.split(' ').map(Number);
        const [bx, by] = b.split(' ').map(Number);
        return by - ay || ax - bx;
      })
      .forEach((coords) => {
        const [cx, cy] = coords.split(' ').map(Number);
        map[cy + 1][cx] = map[cy][cx];
        map[cy][cx] = '.';
      });

    map[y][x] = '.';

    return [x, y + 1];
  },

  /**
   * Move left
   */
  '<': ([x, y]: Coordinates): Coordinates => {
    const closestWall = map[y].lastIndexOf('#', x - 1);
    const closestSpace = map[y].lastIndexOf('.', x - 1);

    if (closestSpace < closestWall) {
      return [x, y];
    }

    map[y].splice(closestSpace, 1);
    map[y].splice(x, 0, '.');

    return [x - 1, y];
  },

  /**
   * Move right
   */
  '>': ([x, y]: Coordinates): Coordinates => {
    const closestWall = map[y].indexOf('#', x + 1);
    const closestSpace = map[y].indexOf('.', x + 1);

    if (closestSpace < 0 || closestSpace > closestWall) {
      return [x, y];
    }

    map[y].splice(closestSpace, 1);
    map[y].splice(x, 0, '.');

    return [x + 1, y];
  },
});

/**
 * Solve robot movements
 * @param map Map
 * @param movements List of movements
 * @param part Problem part 1 or 2
 * @param visualize Show visualization of robot movements. Disabled if 0
 * @returns
 */
const solve = async <T extends WarehouseGrid | WideWarehouseGrid>(
  map: T,
  movements: Readonly<Direction[]>,
  part: 1 | 2,
  visualize: number = 0
): Promise<T> => {
  const movementFunctions =
    part === 1
      ? movementFunctions1(map as WarehouseGrid)
      : movementFunctions2(map as WideWarehouseGrid);

  let position = getStartingPosition(map);

  for (let moveCount = 0; moveCount < movements.length; ++moveCount) {
    const direction = movements[moveCount];

    position = movementFunctions[direction](position);

    if (visualize) {
      drawMap(map);
      console.log({
        position,
        direction,
        moveCount,
        totalMovements: movements.length,
      });
      await new Promise((resolve) => setTimeout(resolve, visualize));
    }
  }

  return map;
};

/**
 * Sum up box positions in the warehouse
 * @param map Warehouse grid output
 * @param char Box representation
 * @returns Goods Positioning System sum
 */
const gpsSum = (map: WarehouseGrid | WideWarehouseGrid, char = 'O'): number =>
  map.reduce(
    (sum, row, i) =>
      sum +
      row.reduce(
        (sum2, col, j) => (col === char ? sum2 + (100 * i + j) : sum2),
        0
      ),
    0
  );

export const part1 = gpsSum(await solve(structuredClone(map), movements, 1));
export const part2 = gpsSum(
  await solve(structuredClone(map2), movements, 2),
  '['
);

console.log({ part1, part2 });
