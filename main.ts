#!/usr/bin/env -S deno run --allow-env="AOC_*" --allow-read="assets/","src/"
import { parseArgs } from 'jsr:@std/cli/parse-args';
import inputPath from 'node:path';

const flags = parseArgs(Deno.args, {
  string: ['day'],
  default: { inputFile: null },
});

const { day, inputFile } = flags;

if (!/^(1?\d|2[0-5])$/.test(day)) {
  throw new Error('Invalid day specified');
}

Deno.env.set(
  'AOC_INPUT_PATH',
  inputFile ?? inputPath.join(import.meta.dirname, 'assets', `day${day}.txt`)
);

const { part1, part2 } = await import(
  import.meta.dirname + `/src/day${day}.ts`
);

console.log({ part1, part2 });
