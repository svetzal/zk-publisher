const path = require('path');
const fs = require('fs').promises;

const frontMatter = require('front-matter');
const ejs = require('ejs');
const markdown = require('markdown-it')({
    html: true,
    replaceLink: function (link, env) {
        return link.replace(/\.md$/, ".html");
    }
}).use(require('markdown-it-replace-link'));

const changeFileExtensionTo = require("../pathManipulation/changeFileExtensionTo");

function canProcess(contents) {
    return !("type" in contents.attributes);
}

async function plainMarkdownTransformer(filePath, source, output) {
    const raw = await fs.readFile(path.join(source, filePath));
    const contents = frontMatter(raw.toString());

    if (!canProcess(contents)) return;

    const tpl = (await fs.readFile('defaultHtmlTemplate.ejs')).toString();
    const html = markdown.render(contents.body);
    let newFilePath = changeFileExtensionTo(filePath, "html");
    let outputFilePath = path.join(output, newFilePath);
    await fs.mkdir(path.dirname(outputFilePath), {recursive: true});
    await fs.writeFile(outputFilePath, ejs.render(tpl, {metadata: contents.attributes, content: html}));
}

module.exports = plainMarkdownTransformer;
