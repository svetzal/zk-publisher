const path = require('path');
const fs = require('fs').promises;

const ejs = require('ejs');
const markdown = require('markdown-it')({
    html: true,
    replaceLink: function (link) {
        return link.replace(/\.md$/, ".html"); // TODO: Ideally, we should determine the real extension used by the transformer that processed? will process? the target
    }
}).use(require('markdown-it-replace-link'));

const Transformer = require("./transformer");

const changeFileExtensionTo = require("../pathManipulation/changeFileExtensionTo");

class PlainMarkdownTransformer extends Transformer {
    canProcess(contents) {
        return !("type" in contents.attributes);
    }

    async transform(filePath, source, output) {
        const tpl = (await fs.readFile('defaultHtmlTemplate.ejs')).toString();
        const html = markdown.render(this.contents.body);
        let newFilePath = changeFileExtensionTo(filePath, "html");
        let outputFilePath = path.join(output, newFilePath);
        await fs.mkdir(path.dirname(outputFilePath), {recursive: true});
        await fs.writeFile(outputFilePath, ejs.render(tpl, {metadata: this.contents.attributes, content: html}));
    }
}

module.exports = PlainMarkdownTransformer;
