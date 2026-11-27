# TypeScript audit — security & efficiency

Generated: 2026-11-27T17:51:42.370Z · commit: `3a855cd` · eslint: 10.15.0

Scope: `extensions/**/*.ts`. Rules: typescript-eslint (strict, type-checked),
eslint-plugin-security, eslint-plugin-regexp (ReDoS), eslint-plugin-sonarjs.

## Summary

| Metric | Value |
|---|---|
| Errors | 118 |
| Warnings | 62 |
| Files scanned | 18 |
| Files with findings | 14 |
| Rules triggered | 30 |

## Findings

### extensions/git-status/git-status.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 54:20 | error | `regexp/no-unused-capturing-group` | Capturing group number 1 is defined but never used. |
| 54:38 | error | `regexp/no-unused-capturing-group` | Capturing group number 2 is defined but never used. |
| 106:23 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 21 to the 15 allowed. |
| 110:24 | error | `@typescript-eslint/no-unused-vars` | 'stderr' is assigned a value but never used. |
| 110:24 | error | `sonarjs/no-unused-vars` | Remove the declaration of the unused 'stderr' variable. |
| 110:24 | error | `sonarjs/no-dead-store` | The value assigned to "stderr" is never read. Use it or remove this assignment. |
| 144:13 | warning | `security/detect-unsafe-regex` | Unsafe Regular Expression |
| 190:4 | error | `@typescript-eslint/no-unused-vars` | 'stale' is assigned a value but never used. |
| 190:4 | error | `sonarjs/no-dead-store` | The value assigned to "stale" is never read. Use it or remove this assignment. |
| 198:14 | warning | `security/detect-unsafe-regex` | Unsafe Regular Expression |
| 225:12 | error | `sonarjs/super-linear-regex` | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. |
| 226:12 | error | `sonarjs/super-linear-regex` | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. |
| 227:12 | error | `sonarjs/super-linear-regex` | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. |
| 267:45 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 279:37 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 283:43 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 284:41 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 285:32 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 288:30 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |

### extensions/pi-obs/src/cli.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 114:17 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 32 to the 15 allowed. |
| 123:3 | warning | `security/detect-possible-timing-attacks` | Potential timing attack, left side: true |
| 127:3 | warning | `security/detect-possible-timing-attacks` | Potential timing attack, left side: true |
| 131:3 | warning | `security/detect-possible-timing-attacks` | Potential timing attack, left side: true |
| 138:18 | warning | `security/detect-object-injection` | Variable Assigned to Object Injection Sink |
| 141:4 | warning | `security/detect-object-injection` | Generic Object Injection Sink |

### extensions/pi-obs/src/config.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 34:26 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 210:19 | warning | `security/detect-object-injection` | Variable Assigned to Object Injection Sink |
| 212:24 | warning | `security/detect-object-injection` | Variable Assigned to Object Injection Sink |
| 213:69 | error | `@typescript-eslint/no-base-to-string` | 'fromSettings' will use Object's default stringification format ('[object Object]') when stringified. |
| 214:18 | error | `@typescript-eslint/no-base-to-string` | 'fromSettings' will use Object's default stringification format ('[object Object]') when stringified. |

### extensions/pi-obs/src/exporters/file.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 58:7 | error | `regexp/no-unused-capturing-group` | Capturing group number 1 is defined but never used. |
| 58:47 | error | `regexp/no-unused-capturing-group` | Capturing group number 1 is defined but never used. |
| 118:2 | error | `@typescript-eslint/require-await` | Async method 'export' has no 'await' expression. |
| 142:4 | warning | `security/detect-non-literal-fs-filename` | Found mkdirSync from package "node:fs" with non literal argument at index 0 |
| 146:7 | warning | `security/detect-non-literal-fs-filename` | Found existsSync from package "node:fs" with non literal argument at index 0 |
| 146:33 | warning | `security/detect-non-literal-fs-filename` | Found statSync from package "node:fs" with non literal argument at index 0 |
| 147:3 | warning | `security/detect-non-literal-fs-filename` | Found appendFileSync from package "node:fs" with non literal argument at index 0 |
| 158:7 | warning | `security/detect-non-literal-fs-filename` | Found existsSync from package "node:fs" with non literal argument at index 0 |
| 158:27 | warning | `security/detect-non-literal-fs-filename` | Found unlinkSync from package "node:fs" with non literal argument at index 0 |
| 161:8 | warning | `security/detect-non-literal-fs-filename` | Found existsSync from package "node:fs" with non literal argument at index 0 |
| 161:26 | warning | `security/detect-non-literal-fs-filename` | Found renameSync from package "node:fs" with non literal argument at index 0,1 |
| 163:3 | warning | `security/detect-non-literal-fs-filename` | Found renameSync from package "node:fs" with non literal argument at index 0,1 |

### extensions/pi-obs/src/exporters/otlp-json.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 49:2 | warning | `security/detect-unsafe-regex` | Unsafe Regular Expression |
| 49:2 | error | `sonarjs/regex-complexity` | Simplify this regular expression to reduce its complexity from 28 to the 20 allowed. |
| 49:73 | error | `regexp/prefer-w` | Unexpected character class ranges '[a-z0-9_]'. Use '\w' instead. |
| 50:8 | error | `regexp/prefer-w` | Unexpected character class ranges '[a-zA-Z0-9_]'. Use '\w' instead. |
| 51:16 | error | `regexp/prefer-w` | Unexpected character class ranges '[a-zA-Z0-9_]'. Use '\w' instead. |
| 51:17 | error | `sonarjs/duplicates-in-character-class` | Remove duplicates in this character class. |
| 51:20 | error | `regexp/no-dupe-characters-character-class` | Unexpected duplicate. 'A-Z' (U+0041 - U+005a) is a duplicate of 'a-z' (U+0061 - U+007a). |
| 188:6 | error | `@typescript-eslint/no-unnecessary-condition` | Unnecessary conditional, comparison is always true, since `"log" === "log"` is true. |

### extensions/pi-obs/src/exporters/otlp.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 92:53 | error | `sonarjs/use-type-alias` | Replace this union type with a type alias. |
| 93:32 | error | `sonarjs/super-linear-regex` | Simplify this regular expression to reduce its runtime, as it has super-linear performance due to backtracking. |
| 94:13 | error | `regexp/no-unused-capturing-group` | Capturing group number 1 is defined but never used. |
| 99:47 | error | `sonarjs/use-type-alias` | Replace this union type with a type alias. |
| 100:36 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 123:82 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |

### extensions/pi-obs/src/index.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 80:38 | error | `@typescript-eslint/no-unnecessary-type-assertion` | This assertion is unnecessary since the receiver accepts the original type of the expression. |
| 102:13 | error | `@typescript-eslint/no-unnecessary-condition` | Unnecessary optional chain on a non-nullish value. |
| 163:21 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 185:64 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 186:63 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 187:59 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 188:64 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 218:48 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed. |
| 242:15 | warning | `security/detect-non-literal-fs-filename` | Found readdirSync from package "node:fs" with non literal argument at index 0 |
| 257:21 | warning | `security/detect-non-literal-fs-filename` | Found statSync from package "node:fs" with non literal argument at index 0 |
| 360:16 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed. |
| 368:3 | warning | `security/detect-possible-timing-attacks` | Potential timing attack, left side: true |
| 454:3 | error | `sonarjs/max-switch-cases` | Reduce the number of non-empty switch cases from 34 to at most 30. |
| 456:28 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 471:18 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 473:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 475:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 477:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 479:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 481:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 483:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 485:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 489:6 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 503:13 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please remove the `return` statement. |
| 506:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 511:13 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please remove the `return` statement. |
| 520:13 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please remove the `return` statement. |
| 556:58 | error | `@typescript-eslint/no-unnecessary-condition` | Unnecessary conditional, the types have no overlap. |
| 556:66 | error | `sonarjs/different-types-comparison` | Remove this "!==" check; it will always be true. Did you mean to use "!="? |
| 563:76 | error | `@typescript-eslint/no-unnecessary-condition` | Unnecessary optional chain on a non-nullish value. |
| 563:105 | error | `@typescript-eslint/no-unnecessary-condition` | Unnecessary optional chain on a non-nullish value. |
| 595:8 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 615:13 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please remove the `return` statement. |
| 618:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 620:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 626:13 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please remove the `return` statement. |
| 703:78 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 765:37 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |

### extensions/pi-obs/src/model.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 147:2 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 318:19 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 379:17 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 17 to the 15 allowed. |
| 381:37 | error | `@typescript-eslint/no-unnecessary-condition` | Unnecessary conditional, the types have no overlap. |
| 381:45 | error | `sonarjs/different-types-comparison` | Remove this "===" check; it will always be false. Did you mean to use "=="? |

### extensions/pi-obs/src/replay.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 101:35 | error | `@typescript-eslint/no-base-to-string` | 'entry.timestamp ?? ""' will use Object's default stringification format ('[object Object]') when stringified. |
| 124:9 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 155:11 | warning | `security/detect-non-literal-fs-filename` | Found readdirSync from package "node:fs" with non literal argument at index 0 |
| 163:18 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 193:12 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 194:12 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 213:17 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 53 to the 15 allowed. |
| 223:78 | warning | `security/detect-object-injection` | Generic Object Injection Sink |

### extensions/pi-obs/src/stats.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 117:17 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 19 to the 15 allowed. |

### extensions/pi-obs/src/version.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 24:26 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |

### extensions/pi-obs/utils/traces-to-html.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 55:13 | error | `@typescript-eslint/no-unnecessary-type-conversion` | Passing a string to String() does not change the type or value of the string. |
| 74:20 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 109:64 | error | `@typescript-eslint/no-unnecessary-type-conversion` | Passing a number to Number() does not change the type or value of the number. |
| 177:2 | warning | `security/detect-non-literal-fs-filename` | Found writeFileSync from package "node:fs" with non literal argument at index 0 |
| 210:14 | error | `@typescript-eslint/no-unused-vars` | 's0' is assigned a value but never used. |
| 210:14 | error | `sonarjs/no-unused-vars` | Remove the declaration of the unused 's0' variable. |
| 210:14 | error | `sonarjs/no-dead-store` | The value assigned to "s0" is never read. Use it or remove this assignment. |
| 212:8 | error | `@typescript-eslint/no-unused-vars` | 'sid' is assigned a value but never used. |
| 212:8 | error | `sonarjs/no-unused-vars` | Remove the declaration of the unused 'sid' variable. |
| 212:8 | error | `sonarjs/no-dead-store` | The value assigned to "sid" is never read. Use it or remove this assignment. |
| 215:125 | error | `sonarjs/no-nested-conditional` | Extract this nested ternary operation into an independent statement. |
| 268:1 | warning | `security/detect-non-literal-fs-filename` | Found writeFileSync from package "node:fs" with non literal argument at index 0 |

### extensions/prompt-trigger/prompt-trigger.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 40:2 | error | `@typescript-eslint/no-unused-vars` | 'newEnvelopeId' is defined but never used. |
| 40:2 | error | `sonarjs/unused-import` | Remove this unused import of 'newEnvelopeId'. |
| 63:3 | warning | `security/detect-non-literal-fs-filename` | Found mkdirSync from package "node:fs" with non literal argument at index 0 |
| 64:3 | warning | `security/detect-non-literal-fs-filename` | Found renameSync from package "node:fs" with non literal argument at index 0,1 |
| 75:6 | error | `@typescript-eslint/no-unused-vars` | 'lastTickAt' is assigned a value but never used. |
| 91:4 | warning | `security/detect-non-literal-fs-filename` | Found writeFileSync from package "node:fs" with non literal argument at index 0 |
| 92:4 | warning | `security/detect-non-literal-fs-filename` | Found renameSync from package "node:fs" with non literal argument at index 0,1 |
| 103:23 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 115:4 | warning | `security/detect-non-literal-fs-filename` | Found appendFileSync from package "node:fs" with non literal argument at index 0 |
| 125:5 | warning | `security/detect-non-literal-fs-filename` | Found mkdirSync from package "node:fs" with non literal argument at index 0 |
| 135:12 | warning | `security/detect-non-literal-fs-filename` | Found readdirSync from package "node:fs" with non literal argument at index 0 |
| 135:72 | error | `sonarjs/no-alphabetical-sort` | Provide a compare function that depends on "String.localeCompare", to reliably sort elements alphabetically. |
| 141:10 | warning | `security/detect-non-literal-fs-filename` | Found unlinkSync from package "node:fs" with non literal argument at index 0 |
| 141:45 | warning | `security/detect-object-injection` | Function Call Object Injection Sink |
| 150:12 | warning | `security/detect-non-literal-fs-filename` | Found readdirSync from package "node:fs" with non literal argument at index 0 |
| 166:5 | error | `sonarjs/no-redundant-jump` | Remove this "continue" that does not affect the flow of execution. |
| 180:19 | warning | `security/detect-object-injection` | Generic Object Injection Sink |
| 203:8 | warning | `security/detect-non-literal-fs-filename` | Found existsSync from package "node:fs" with non literal argument at index 0 |
| 206:4 | warning | `security/detect-non-literal-fs-filename` | Found writeFileSync from package "node:fs" with non literal argument at index 0 |
| 207:4 | warning | `security/detect-non-literal-fs-filename` | Found renameSync from package "node:fs" with non literal argument at index 0,1 |
| 210:10 | warning | `security/detect-non-literal-fs-filename` | Found unlinkSync from package "node:fs" with non literal argument at index 0 |
| 251:5 | warning | `security/detect-non-literal-fs-filename` | Found writeFileSync from package "node:fs" with non literal argument at index 0 |
| 309:12 | warning | `security/detect-non-literal-fs-filename` | Found readdirSync from package "node:fs" with non literal argument at index 0 |
| 313:28 | error | `sonarjs/no-alphabetical-sort` | Provide a compare function that depends on "String.localeCompare", to reliably sort elements alphabetically. |
| 337:11 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 352:14 | warning | `security/detect-non-literal-fs-filename` | Found readFileSync from package "node:fs" with non literal argument at index 0 |
| 393:4 | warning | `security/detect-non-literal-fs-filename` | Found unlinkSync from package "node:fs" with non literal argument at index 0 |
| 401:11 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 32 to the 15 allowed. |
| 409:12 | warning | `security/detect-non-literal-fs-filename` | Found readdirSync from package "node:fs" with non literal argument at index 0 |
| 417:28 | error | `sonarjs/no-alphabetical-sort` | Provide a compare function that depends on "String.localeCompare", to reliably sort elements alphabetically. |
| 423:10 | warning | `security/detect-non-literal-fs-filename` | Found statSync from package "node:fs" with non literal argument at index 0 |
| 449:15 | error | `sonarjs/no-all-duplicated-branches` | This conditional operation returns the same value whether the condition is "true" or "false". |
| 461:3 | error | `sonarjs/no-dead-store` | The value assigned to "lastTickAt" is never read. Use it or remove this assignment. |
| 466:45 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 470:22 | error | `@typescript-eslint/no-base-to-string` | '(ctx as { sessionManager?: { getSessionId?: () => unknown } }).sessionManager?.getSessionId?.() ?? "unknown"' will use Object's default stringification format ('[object Object]') when stringified. |
| 477:29 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from an arrow function shorthand is forbidden. Please add braces to the arrow function. |
| 483:37 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 489:32 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |
| 492:41 | error | `@typescript-eslint/require-await` | Async arrow function has no 'await' expression. |

### extensions/prompt-trigger/src/envelope.ts

| Line:Col | Severity | Rule | Message |
|---|---|---|---|
| 66:32 | error | `regexp/prefer-w` | Unexpected character class ranges '[A-Za-z0-9_]'. Use '\w' instead. |
| 66:48 | error | `regexp/use-ignore-case` | The character class(es) '[A-Za-z0-9]', '[A-Za-z0-9._-]' can be simplified using the `i` flag. |
| 76:10 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 16 to the 15 allowed. |
| 76:10 | error | `sonarjs/function-return-type` | Refactor this function to always return the same type. |
| 108:17 | error | `sonarjs/cognitive-complexity` | Refactor this function to reduce its Cognitive Complexity from 25 to the 15 allowed. |
| 120:10 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 123:10 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 127:18 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 129:20 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 131:18 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 133:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 136:10 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 140:10 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 143:10 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 146:10 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 149:23 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 150:48 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 152:55 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 155:37 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |
| 157:52 | error | `@typescript-eslint/no-confusing-void-expression` | Returning a void expression from a function is forbidden. Please move it before the `return` statement. |

## Top rules

- `security/detect-non-literal-fs-filename`: 41
- `@typescript-eslint/no-confusing-void-expression`: 40
- `security/detect-object-injection`: 14
- `@typescript-eslint/require-await`: 11
- `sonarjs/cognitive-complexity`: 10
- `@typescript-eslint/no-unnecessary-condition`: 6
- `@typescript-eslint/no-unused-vars`: 6
- `regexp/no-unused-capturing-group`: 5
- `sonarjs/no-dead-store`: 5
- `@typescript-eslint/no-base-to-string`: 4
