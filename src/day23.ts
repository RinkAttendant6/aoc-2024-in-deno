import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const AOC_DAY = 23;
const inputPath =
  process.env.AOC_INPUT_PATH ??
  path.join(import.meta.dirname!, '..', 'assets', `day${AOC_DAY}.txt`);

const rawData = (await fs.readFile(inputPath, 'utf-8')).trim();

const data = rawData.split('\n').map((x) => x.split('-'));

const edgeList: Record<string, Set<string>> = {};

for (const [v1, v2] of data) {
  edgeList[v1] ??= new Set();
  edgeList[v2] ??= new Set();
  edgeList[v1].add(v2);
  edgeList[v2].add(v1);
}

const nodes = Object.keys(edgeList);
const groupsOfThree = [];

for (let i = 0; i < nodes.length - 2; ++i) {
  const edgeList1 = edgeList[nodes[i]];

  for (let j = i + 1; j < nodes.length - 1; ++j) {
    if (edgeList1.has(nodes[j])) {
      const edgeList2 = edgeList[nodes[j]];

      for (let k = j + 1; k < nodes.length; ++k) {
        if (edgeList1.has(nodes[k]) && edgeList2.has(nodes[k])) {
          groupsOfThree.push([nodes[i], nodes[j], nodes[k]]);
        }
      }
    }
  }
}

export const part1 = groupsOfThree.filter((s) =>
  s.some((c) => c.startsWith('t'))
).length;

const completeGraphGroups: Set<string>[] = [];

for (const node of nodes) {
  const group = new Set([node]);
  const queue = [...edgeList[node]];

  while (queue.length > 0) {
    const node = queue.shift()!;
    const adjacent = edgeList[node];
    if (group.isSubsetOf(adjacent)) {
      group.add(node);
      queue.push(...edgeList[node]);
    }
  }

  completeGraphGroups.push(group);
}

const biggestGroup = Math.max(
  ...completeGraphGroups.map((group) => group.size)
);

export const part2 = [
  ...completeGraphGroups.find((group) => group.size === biggestGroup)!,
]
  .sort()
  .join(',');

console.log({ part1, part2 });
