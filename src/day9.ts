import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 9;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('').map(Number);

/**
 * Solve part 1
 */
const solve1 = (data: number[]) => {
  const diskSize = data.reduce((sum, x) => sum + x, 0);
  const sparse: (number | null)[] = new Array(diskSize);

  let id = 0;
  let pointer = 0;
  let fileBlocks = 0;

  for (let i = 0; i < data.length; ++i) {
    const v = data[i];

    if (i % 2 === 0) {
      // file
      sparse.splice(pointer, v, ...Array(v).fill(id));
      fileBlocks += v;
      ++id;
    } else {
      // free space
      sparse.splice(pointer, v, ...Array(v).fill(null));
    }

    pointer += v;
  }

  while (sparse.findLastIndex((block) => block !== null) >= fileBlocks) {
    const lastBlockIdx = sparse.findLastIndex((block) => block !== null);
    const firstNullIdx = sparse.findIndex((block) => block === null);

    sparse[firstNullIdx] = sparse[lastBlockIdx];
    sparse[lastBlockIdx] = null;
  }

  return sparse.reduce(
    (sum: number, block: number | null, i) => (block ? sum + block * i : sum),
    0
  );
};

/**
 * Solve part 2
 */
const solve2 = (data: number[]): number => {
  let id = 0;
  let pointer = 0;

  type DiskMeta = { start: number; length: number };

  const fileMap: Record<number, DiskMeta> = {};
  const freeSpaceMap: DiskMeta[] = [];

  for (let i = 0; i < data.length; ++i) {
    const v = data[i];

    if (i % 2 === 0) {
      // file
      fileMap[id] = { start: pointer, length: v };
      ++id;
    } else {
      // free space
      freeSpaceMap.push({ start: pointer, length: v });
    }

    pointer += v;
  }

  while (--id) {
    const { start, length } = fileMap[id];

    const holeIdx = freeSpaceMap.findIndex(
      (fs) => fs.length >= length && fs.start < start
    );

    if (holeIdx > -1) {
      fileMap[id].start = freeSpaceMap[holeIdx].start;
      freeSpaceMap[holeIdx].start += length;
      freeSpaceMap[holeIdx].length -= length;
    }
  }

  return Object.entries(fileMap).reduce((sum, [id, { start, length }]) => {
    for (let i = 0; i < length; ++i) {
      sum += Number(id) * (start + i);
    }
    return sum;
  }, 0);
};

export const part1 = solve1(data);
export const part2 = solve2(data);

console.log({ part1, part2 });
