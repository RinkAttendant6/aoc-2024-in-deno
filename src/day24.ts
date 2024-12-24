import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 24;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n\n');

/**
 * Check whether an object is empty
 */
const isEmpty = (obj: object): boolean => {
  for (const prop in obj) if (Object.hasOwn(obj, prop)) return false;
  return true;
};

const wires = Object.fromEntries(
  data[0].split('\n').map((wire) => {
    const [key, value] = wire.split(': ');
    return [key, Number(value)];
  })
);

const gates: Record<string, string> = Object.fromEntries(
  data[1].split('\n').map((gate) => gate.split(' -> ').reverse())
);

while (!isEmpty(gates)) {
  for (const [k, g] of Object.entries(gates)) {
    const [a, op, b] = g.split(' ');

    if (a in wires && b in wires) {
      wires[k] = {
        AND: wires[a] & wires[b],
        OR: wires[a] | wires[b],
        XOR: wires[a] ^ wires[b],
      }[op]!;

      delete gates[k];
    }
  }
}

export const part1 = Number.parseInt(
  Object.entries(wires)
    .filter(([key, _]) => key.startsWith('z'))
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([_, value]) => value)
    .join(''),
  2
);

console.log({ part1 });
