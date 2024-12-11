import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 11;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split(' ').map(Number);

/** Hashmap of memoized processed values to speed up processing */
const memo: Record<string, number[]> = { '0': [1] };

/**
 * Process each stone
 */
const processStone = (stone: string) => {
  if (!Object.hasOwn(memo, stone)) {
    memo[stone] =
      stone.length % 2
        ? [Number(stone) * 2024]
        : [
            Number(stone.slice(0, stone.length / 2)),
            Number(stone.slice(stone.length / 2)),
          ];
  }

  return memo[stone];
};

const stoneMaps: Record<string, number>[] = [{}];

// populate initial values
for (const stone of data) {
  stoneMaps[0][stone] ??= 0;
  ++stoneMaps[0][stone];
}

for (let blinks = 1; blinks <= 75; ++blinks) {
  const newMap: Record<string, number> = {};

  for (const [stone, qty] of Object.entries(stoneMaps[blinks - 1])) {
    for (const newStone of processStone(stone)) {
      newMap[newStone] ??= 0;
      newMap[newStone] += qty;
    }
  }

  stoneMaps.push(newMap);
}

export const part1 = Object.values(stoneMaps[25]!).reduce(
  (sum, qty) => sum + qty
);
export const part2 = Object.values(stoneMaps[75]!).reduce(
  (sum, qty) => sum + qty
);

console.log({ part1, part2 });
