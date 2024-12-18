import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 17;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.trim().split('\n\n');

/**
 * Execute the program
 */
const execute = (
  a: number,
  b: number,
  c: number,
  program: number[]
): number[] => {
  const output: number[] = [];

  const resolveComboOperand = (operand: number): number => {
    if (operand === 4) return a;
    if (operand === 5) return b;
    if (operand === 6) return c;

    return operand;
  };

  const operations: ((operand: number) => number | undefined)[] = [
    // 0 adv
    (operand) => void (a = Math.floor(a / 2 ** resolveComboOperand(operand))),
    // 1 bxl
    (operand) => void (b ^= operand),
    // 2 bst
    (operand) => void (b = resolveComboOperand(operand) % 8),
    // 3 jnz
    (operand) => (a === 0 ? undefined : operand),
    // 4 bxc
    () => void (b ^= c),
    // 5 out
    (operand) => void output.push(resolveComboOperand(operand) % 8),
    // 6 bdv
    (operand) => void (b = Math.floor(a / 2 ** resolveComboOperand(operand))),
    // 7 cdv
    (operand) => void (c = Math.floor(a / 2 ** resolveComboOperand(operand))),
  ];

  for (let pointer = 0; pointer < program.length; ) {
    const operator = program[pointer];
    const operand = program[pointer + 1];
    const jumpTo = operations[operator](operand);

    pointer = jumpTo ?? pointer + 2;
  }

  return output;
};

const [a, b, c] = data[0].split('\n').map((x) => +x.slice(12));

const rawProgram = data[1].slice(9);
const program = rawProgram.split(',').map(Number);

export const part1 = execute(a, b, c, program).join(',');

console.log({ part1 });

export let part2: number = 0;

do {
  if (execute(part2, b, c, program).join(',') === rawProgram) break;
  ++part2;
} while (true);

console.log({ part1, part2 });
