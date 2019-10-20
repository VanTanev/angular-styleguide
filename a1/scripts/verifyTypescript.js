#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const contents = fs.readFileSync("../README.md", "utf8");
const re = /\`\`\`typescript\n(?<code>[@\w\s+?{}()*=\/:;<>.'\\&$,"\[\]-]+)/;

const HEADER = `
  import angular from 'angular'

\n`;

const examplePath = path.join(__dirname, "tmp", "example.ts");
for (let string of contents.match(new RegExp(re, "g"))) {
  const source = HEADER + string.match(re).groups.code;
  // const sourceFile  = ts.createSourceFile('example.ts', source, ts.ScriptTarget.Latest)
  console.log('============================================');
  console.log(source);
  fs.writeFileSync(examplePath, source);
  const program = ts.createProgram([examplePath], { esModuleInterop: true });
  const diagnostics = ts.getPreEmitDiagnostics(program);

  for (const diagnostic of diagnostics) {
    const message = diagnostic.messageText;
    const file = diagnostic.file;
    const filename = file.fileName;

    const lineAndChar = file.getLineAndCharacterOfPosition(diagnostic.start);

    const line = lineAndChar.line + 1;
    const character = lineAndChar.character + 1;

    console.log(message);
    console.log(`(${filename}:${line}:${character})`);
    return;
  }
}
