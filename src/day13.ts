import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 13;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n\n');

/**
 * Solve efficiently using linear equations
 *
 * Example: Solve for a and b in (94a + 22b = 8400), (34a + 67b = 5400)
 *
 * Isolate for a:
 * 34a = 5400 - 67b
 * a = (5400 - 67b) / 34
 *
 * Solve for b:
 * 94 * ((5400 - 67b) / 34) + 22b = 8400
 * (94 * (5400 - 67b)) / 34) + 22b = 8400
 * (94 * 5400 - 94 * 67b) / 34 + 22b = 8400
 * (94 * 5400 - 94 * 67b + 22b * 34) / 34 = 8400
 * 94 * 5400 - 94 * 67b + 22b * 34 = 8400 * 34
 * -94 * 67b + 22b * 34 = 8400 * 34 - 94 * 5400
 * (-94 * 67 + 22 * 34)b = 8400 * 34 - 94 * 5400
 * b = (8400 * 34 - 94 * 5400) / (-94 * 67 + 22 * 34)
 *
 * Isolate for b:
 * 67b = 5400 - 34a
 * b = (5400 - 34a) / 67
 *
 * Solve for a:
 * 94a + 22 * ((5400 - 34a) / 67) = 8400
 * 94a + (22 * 5400 - 22 * 34a) / 67 = 8400
 * (67 * 94a + 22 * 5400 - 22 * 34a) / 67 = 8400
 * 67 * 94a + 22 * 5400 - 22 * 34a = 8400 * 67
 * 67 * 94a - 22 * 34a = 8400 * 67 - 22 * 5400
 * (67 * 94 - 22 * 34)a = 8400 * 67 - 22 * 5400
 * a = (8400 * 67 - 22 * 5400) / (67 * 94 - 22 * 34)
 *
 * @param {string[]} machines Input data for all machines
 * @param {number} offset
 * @returns {number} Sum of tokens needed for all prizes
 */
const solve = (machines: string[], offset: number = 0): number =>
  machines.reduce((tokens, machine) => {
    const [aCoefficient1, aCoefficient2, bCoefficient1, bCoefficient2, px, py] =
      machine.matchAll(/\d+/g).map((match) => Number(match[0]));

    const result1 = px + offset;
    const result2 = py + offset;

    const a =
      (result1 * bCoefficient2 - bCoefficient1 * result2) /
      (bCoefficient2 * aCoefficient1 - bCoefficient1 * aCoefficient2);

    const b =
      (result1 * aCoefficient2 - aCoefficient1 * result2) /
      (-aCoefficient1 * bCoefficient2 + bCoefficient1 * aCoefficient2);

    if (Number.isInteger(a) && Number.isInteger(b)) {
      // solution found, add to total tokens
      return tokens + (3 * a + b);
    }

    // did not find solution
    return tokens;
  }, 0);

export const part1 = solve(data);
export const part2 = solve(data, 10_000_000_000_000);

console.log({ part1, part2 });
