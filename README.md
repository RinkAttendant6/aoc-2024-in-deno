# Advent of Code 2024 in Deno

Solutions to AoC 2024 problems in TypeScript and/or JavaScript.

Also see: https://deno.com/blog/advent-of-code-2024

## Run

Input data is not included in the repository and must be added to the assets folder in the format of `day#.txt` (e.g. `day1.txt`) at runtime.

Alternatively, all scripts take a file path in the `AOC_INPUT_PATH` environment variable.

Specify the day in the day parameter:

```shell
# Deno
deno task start --day=1

# Node (requires Node 22.12 LTS)
node --disable-warning=ExperimentalWarning --experimental-strip-types src/day1.ts
```
