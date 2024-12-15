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
  .replaceAll(/#/g, '##')
  .replaceAll(/O/g, '[]')
  .replaceAll(/\./g, '..')
  .replaceAll(/@/g, '@.')
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
 * Solve part 1
 * @param map Warehouse grid input
 * @param movements List of movements
 * @param visualize Visualize the robot movement. Disabled if 0
 */
const solve1 = async (
  map: WarehouseGrid,
  movements: Readonly<Direction[]>,
  visualize: number = 0
): Promise<WarehouseGrid> => {
  let [x, y] = getStartingPosition(map);

  for (let movementIdx = 0; movementIdx < movements.length; ++movementIdx) {
    const direction = movements[movementIdx];
    const currentRow = map[y];
    const currentCol = map.map((row) => row[x]);

    const moveFunctions: Record<Direction, (arg0: Coordinates) => Coordinates> =
      {
        '^': ([x, y]: Coordinates): Coordinates => {
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
        v: ([x, y]: Coordinates): Coordinates => {
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
        '<': ([x, y]: Coordinates): Coordinates => {
          const closestWall = currentRow.lastIndexOf('#', x - 1);
          const closestSpace = currentRow.lastIndexOf('.', x - 1);

          if (closestSpace < closestWall) {
            return [x, y];
          }

          map[y].splice(closestSpace, 1);
          map[y].splice(x, 0, '.');

          return [x - 1, y];
        },
        '>': ([x, y]: Coordinates): Coordinates => {
          const closestWall = currentRow.indexOf('#', x + 1);
          const closestSpace = currentRow.indexOf('.', x + 1);

          if (closestSpace < 0 || closestSpace > closestWall) {
            return [x, y];
          }

          map[y].splice(closestSpace, 1);
          map[y].splice(x, 0, '.');

          return [x + 1, y];
        },
      };

    [x, y] = moveFunctions[direction]([x, y]);

    if (visualize) {
      drawMap(map, true);
      console.log({
        direction,
        movementIdx,
        totalMovements: movements.length,
      });
      await new Promise((resolve) => setTimeout(resolve, visualize));
    }
  }

  return map;
};

/**
 * Solve part 2
 * @param map Warehouse grid input
 * @param movements List of movements
 * @param visualize Visualize the robot movement. Disabled if 0
 */
const solve2 = async (
  map: WideWarehouseGrid,
  movements: Readonly<Direction[]>,
  visualize: number = 0
): Promise<WideWarehouseGrid> => {
  let [x, y] = getStartingPosition(map);

  for (let moveCount = 0; moveCount < movements.length; ++moveCount) {
    const direction = movements[moveCount];
    const currentRow = map[y];

    const moveFunctions: Record<Direction, (arg0: Coordinates) => Coordinates> =
      {
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

          // get affected boxes
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
        '<': ([x, y]: Coordinates): Coordinates => {
          const closestWall = currentRow.lastIndexOf('#', x - 1);
          const closestSpace = currentRow.lastIndexOf('.', x - 1);

          if (closestSpace < closestWall) {
            return [x, y];
          }

          map[y].splice(closestSpace, 1);
          map[y].splice(x, 0, '.');

          return [x - 1, y];
        },
        '>': ([x, y]: Coordinates): Coordinates => {
          const closestWall = currentRow.indexOf('#', x + 1);
          const closestSpace = currentRow.indexOf('.', x + 1);

          if (closestSpace < 0 || closestSpace > closestWall) {
            return [x, y];
          }

          map[y].splice(closestSpace, 1);
          map[y].splice(x, 0, '.');

          return [x + 1, y];
        },
      };

    [x, y] = moveFunctions[direction]([x, y]);

    if (visualize) {
      drawMap(map);
      console.log({
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

export const part1 = gpsSum(await solve1(structuredClone(map), movements));
export const part2 = gpsSum(
  await solve2(structuredClone(map2), movements),
  '['
);

console.log({ part1, part2 });
