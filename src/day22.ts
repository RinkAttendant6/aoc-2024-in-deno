import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 22;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.trim().split('\n').map(BigInt);

const transform = (x: bigint) => {
  x ^= x << 6n;
  x %= 16777216n;
  x ^= x >> 5n;
  x %= 16777216n;
  x ^= x << 11n;
  x %= 16777216n;

  return x;
};

export const part1 = Number(
  data.reduce((sum, x) => {
    for (let i = 0; i < 2000; ++i) {
      x = transform(x);
    }

    return sum + x;
  }, 0n)
);

console.log({ part1 });
