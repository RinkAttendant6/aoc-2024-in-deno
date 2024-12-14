import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

type RobotCoords = { px: number; py: number; vx: number; vy: number };

const AOC_DAY = 14;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data: RobotCoords[] = rawData
  .split('\n')
  .map(
    (line) =>
      Object.fromEntries(
        Object.entries(
          /^p=(?<px>\d+),(?<py>\d+) v=(?<vx>-?\d+),(?<vy>-?\d+)$/.exec(line)!
            .groups!
        ).map(([k, v]) => [k, Number(v)])
      ) as RobotCoords
  );

const height = 103;
const midY = Math.floor(height / 2);

const width = 101;
const midX = Math.floor(width / 2);

/**
 * Move the robot coordinates given the number of iterations
 * @returns New position
 */
const move = (
  { px, py, vx, vy }: RobotCoords,
  iterations: number
): [number, number] => {
  const x = px + ((Math.abs(vx) * iterations) % width) * (vx > 0 ? 1 : -1);
  const y = py + ((Math.abs(vy) * iterations) % height) * (vy > 0 ? 1 : -1);

  // Ensure stay in bounds after moving
  return [(x + width) % width, (y + height) % height];
};

export const part1 = ((iterations = 100) => {
  const newPositions = data.map((coords) => move(coords, iterations));
  return (
    newPositions.filter(([x, y]) => x < midX && y < midY).length *
    newPositions.filter(([x, y]) => x < midX && y > midY).length *
    newPositions.filter(([x, y]) => x > midX && y < midY).length *
    newPositions.filter(([x, y]) => x > midX && y > midY).length
  );
})();

export const part2 = (() => {
  let iterations = 0;

  do {
    const s = new Set();

    for (const coords of data) {
      const [x, y] = move(coords, iterations);
      const canonical = `${x} ${y}`;

      if (s.has(canonical)) {
        // overlap, skip checking rest of robots
        break;
      }
      s.add(canonical);
    }

    if (s.size === data.length) break;

    ++iterations;
  } while (true);

  return iterations;
})();

console.log({ part1, part2 });
