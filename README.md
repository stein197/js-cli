# Command Line Interface utilities

## Installation
```
npm install @stein197/cli
```

## Usage
```ts
import * as arg from "@stein197/cli/arg";

arg.parse("--opt1 val1 -- str1"); // {args: ["str1"], opts: {opt1: "val1"}}
```

## API
| Module | Functions |
|--------|-----------|
| arg    | parse     |

> NOTE. Please, refer to docblocks in the source code for more detailed documentation.

## npm scripts
- `build` run `clean`, `test` and `ts` scripts
- `clean` delete compiled files
- `test` run tests
- `ts` compile the project
- `ts:check` run compile check
