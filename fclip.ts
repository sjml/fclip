import * as prettier from "prettier";
import denoJson from "./deno.json" with { type: "json" };


const pluginNameList = Object.keys(denoJson.imports).filter(i => i != "prettier");
const pluginList = [];
for (const name of pluginNameList) {
    const plug = await import(name);
    pluginList.push(plug);
}

const info = await prettier.getSupportInfo({
    plugins: pluginList,
});

const langToParsers: Map<string, string[]> = new Map();
let parserList: string[] = [];

for (const lang of info.languages) {
    parserList = parserList.concat(lang.parsers);

    let names = [];
    if (lang.aceMode) {
        names.push(lang.aceMode);
    }
    if (lang.codemirrorMode) {
        names.push(lang.codemirrorMode);
    }
    if (lang.aliases) {
        names = names.concat([...lang.aliases]);
    }
    if (lang.vscodeLanguageIds) {
        names = names.concat([...lang.vscodeLanguageIds]);
    }

    names = Array.from(new Set(names));

    for (const name of names) {
        let parserList = langToParsers.get(name) || [];
        parserList = parserList.concat(lang.parsers);
        parserList = Array.from(new Set(parserList)).sort();
        langToParsers.set(name, parserList);
    }
}

parserList = Array.from(new Set(parserList)).sort();

if (Deno.args.length == 0) {
    console.error(`Enter a parser! Options are: \n    ${parserList.join(', ')}`);
    Deno.exit(1);
}

const copyCommand = new Deno.Command("pbpaste");
const results = await copyCommand.output();
const clipboardText = new TextDecoder("utf-8").decode(results.stdout);

let formatted;
try {
    formatted = await prettier.format(clipboardText, {parser: Deno.args[0]});
} catch (err) {
    console.error(`Could not parse clipboard as '${Deno.args[0]}'! Error: \n  ${err}`);
    Deno.exit(1);
}

const pasteCommand = new Deno.Command("pbcopy", { stdin: "piped" });
const pasteProcess = pasteCommand.spawn();

const pasteWriter = pasteProcess.stdin.getWriter();
pasteWriter.write(new TextEncoder().encode(formatted));
pasteWriter.releaseLock();

pasteProcess.stdin.close();

const pasteResult = await pasteProcess.output();
if (pasteResult.code != 0) {
    console.error(`Error pasting: \n  ${new TextDecoder("utf-8").decode(pasteResult.stderr)}`);
    Deno.exit(pasteResult.code);
}
