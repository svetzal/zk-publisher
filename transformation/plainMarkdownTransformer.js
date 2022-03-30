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

const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

class PlainMarkdownTransformer extends Transformer {
    canProcess(contents) {
        return !("type" in contents.attributes);
    }

    async transform(filePath, source, output) {
        const fullTemplatePathname = this.getFullTemplatePathname();
        const template = await this.readFileToString(fullTemplatePathname);
        const html = markdown.render(this.contents.body);

        let newFilePath = this.getNewFilepath(filePath, output, "pptx");
        await prepareOutputDirectory(path.dirname(newFilePath));

        await fs.writeFile(newFilePath, ejs.render(template, {metadata: this.contents.attributes, content: html}));
    }
}

module.exports = PlainMarkdownTransformer;
