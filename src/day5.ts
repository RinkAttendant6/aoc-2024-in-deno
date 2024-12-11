import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 5;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const data = (await fs.readFile(inputPath, 'utf-8')).trim();

/**
 * Reducer to sum the middle page numbers
 */
const middleSumReducer = (sum: number, pages: number[]) =>
  sum + pages[(pages.length - 1) / 2];

const [rawRules, rawManuals] = data
  .split('\n\n')
  .map((parts) => parts.split('\n'));

const rules = rawRules.map((z) => z.split('|').map(Number));
const manuals = rawManuals.map((z) => z.split(',').map(Number));

export const part1 = manuals
  .filter((pages) =>
    rules
      .filter(([a, b]) => pages.includes(a) && pages.includes(b))
      .every(([a, b]) => pages.indexOf(a) < pages.indexOf(b))
  )
  .reduce(middleSumReducer, 0);

export const part2 = manuals
  .filter(
    (pages) =>
      !rules
        .filter(([a, b]) => pages.includes(a) && pages.includes(b))
        .every(([a, b]) => pages.indexOf(a) < pages.indexOf(b))
  )
  .map((pages) =>
    pages.sort((p, q) => {
      const applicableRules = rules.filter(
        ([a, b]) => pages.includes(a) && pages.includes(b)
      );

      for (const [a, b] of applicableRules) {
        if (p === a && q === b) {
          return 1;
        }

        if (p === b && q === a) {
          return -1;
        }
      }

      return 0;
    })
  )
  .reduce(middleSumReducer, 0);

console.log({ part1, part2 });
