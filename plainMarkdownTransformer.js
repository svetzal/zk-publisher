const path = require('path');
const fs = require('fs').promises;
const {markdown} = require('markdown');
const frontMatter = require('front-matter');
const ejs = require('ejs');
const changeFileExtensionTo = require("./changeFileExtensionTo");

function canProcess(contents) {
    if (!("type" in contents.attributes)) return true;
    return false;
}

async function plainMarkdownTransformer(filePath, source, output) {
    const raw = await fs.readFile(path.join(source, filePath));
    const contents = frontMatter(raw.toString());

    if (!canProcess(contents)) return;

    const tpl = (await fs.readFile('defaultHtmlTemplate.ejs')).toString();
    const html = markdown.toHTML(contents.body);
    let newFilePath = changeFileExtensionTo(filePath, "html");
    let outputFilePath = path.join(output, newFilePath);
    await fs.mkdir(path.dirname(outputFilePath), {recursive: true});
    await fs.writeFile(outputFilePath, ejs.render(tpl, {metadata: contents.attributes, content: html}));
}

module.exports = plainMarkdownTransformer;
