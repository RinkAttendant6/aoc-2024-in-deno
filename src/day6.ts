import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 6;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);
const data = (await fs.readFile(inputPath, 'utf-8')).trim();

const maze = data.split('\n').map((row) => row.split(''));
const height = maze.length;
const width = maze[0].length;

type Direction = 'up' | 'down' | 'left' | 'right';

let direction: Direction = 'up';
let y = maze.findIndex((row) => row.includes('^'));
let x = maze[y].indexOf('^');

maze[y][x] = 'X';

do {
  const [nextX, nextY] = {
    up: [x, y - 1],
    down: [x, y + 1],
    left: [x - 1, y],
    right: [x + 1, y],
  }[direction];

  // is obstacle?
  if (maze[nextY][nextX] === '#') {
    // turn
    switch (direction) {
      case 'up':
        direction = 'right';
        break;
      case 'down':
        direction = 'left';
        break;
      case 'left':
        direction = 'up';
        break;
      case 'right':
        direction = 'down';
        break;
    }
  } else {
    // go forward
    x = nextX;
    y = nextY;
    maze[y][x] = 'X';
  }
} while (x > 0 && y > 0 && y < height - 1 && x < width - 1);

export const part1 = maze.reduce(
  (sum, row) => sum + row.filter((cell) => cell === 'X').length,
  0
);

console.log({ part1 });
