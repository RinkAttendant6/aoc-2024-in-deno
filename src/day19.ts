import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 19;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.trim().split('\n\n');

/** Memoization cache for number of designs possible */
const cache: Record<string, number> = {};

/**
 * Count number of possible designs for a given towen and set of patterns
 */
const countDesigns = (towel: string, patterns: string[]): number => {
  if (towel === '') {
    return 1;
  }

  cache[towel] ??= patterns
    .filter((pattern) => towel.startsWith(pattern))
    .reduce(
      (sum, pattern) =>
        sum + countDesigns(towel.slice(pattern.length), patterns),
      0
    );

  return cache[towel];
};

const patterns = data[0].split(', ').sort();
const towels = data[1].split('\n');

export const part1 = towels.filter((towel) =>
  countDesigns(towel, patterns)
).length;

export const part2 = towels.reduce(
  (sum, towel) => sum + countDesigns(towel, patterns),
  0
);

console.log({ part1, part2 });
