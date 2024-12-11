import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 8;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n').map((row) => row.split(''));

type Coordinate = [number, number];

/**
 * Determine if a coordinate is in bounds
 */
const isInBounds = ([x, y]: Coordinate) =>
  x >= 0 && y >= 0 && x < data[0].length && y < data.length;

/**
 * Get antinodes of two coordinates
 */
const getAntinodes = (
  src: Coordinate,
  dest: Coordinate,
  repeating: boolean = true
): Coordinate[] => {
  const antinodes: Coordinate[] = [];

  const [srcX, srcY] = src;
  const [destX, destY] = dest;
  const diffX = destX - srcX;
  const diffY = destY - srcY;

  let a1: Coordinate = [srcX - diffX, srcY - diffY];
  let a2: Coordinate = [destX + diffX, destY + diffY];

  while (isInBounds(a1)) {
    antinodes.push(a1);
    if (!repeating) break;
    a1 = [a1[0] - diffX, a1[1] - diffY];
  }
  while (isInBounds(a2)) {
    antinodes.push(a2);
    if (!repeating) break;
    a2 = [a2[0] + diffX, a2[1] + diffY];
  }

  return antinodes;
};

const antennas: Record<string, Coordinate[]> = {};

data.forEach((row, y) => {
  row.forEach((char, x) => {
    if (char !== '.') {
      antennas[char] ??= [];
      antennas[char].push([x, y]);
    }
  });
});

const antinodes1: Coordinate[] = [];
const antinodes2: Coordinate[] = [];

for (const locations of Object.values(antennas)) {
  for (let i = 1; i < locations.length; ++i) {
    const src = locations[i];

    for (let j = 0; j < i; ++j) {
      const dest = locations[j];

      antinodes1.push(...getAntinodes(src, dest, false));
      antinodes2.push(src, dest, ...getAntinodes(src, dest));
    }
  }
}

export const part1 = new Set(antinodes1.map(([x, y]) => x + ' ' + y)).size;
export const part2 = new Set(antinodes2.map(([x, y]) => x + ' ' + y)).size;

console.log({ part1, part2 });
