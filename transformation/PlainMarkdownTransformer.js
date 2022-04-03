const path = require('path');
const fs = require('fs').promises;

const ejs = require('ejs');
const markdown = require('markdown-it');
const markdownReplaceLink = require('markdown-it-replace-link');

const Transformer = require("./Transformer");

const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

class PlainMarkdownTransformer extends Transformer {
    constructor(template, siteMap) {
        super(template);
        this.siteMap = siteMap;
    }

    canProcessWithContents(contents) {
        return !("type" in contents.attributes);
    }

    getNewExtension() {
        return "html";
    }

    async transform(filePath, source, output) {
        const transformer = this;
        const contents = await this.getContents(filePath, source);
        const fullTemplatePathname = this.getFullTemplatePathname();
        const template = await this.readFileToString(fullTemplatePathname);

        let newFilePath = this.calculateOutputFilePath(filePath, output, this.getNewExtension());
        await prepareOutputDirectory(path.dirname(newFilePath));

        const mdp = markdown(
            {
                html: true,
                replaceLink: function (link) {
                    let target = transformer.siteMap.getMetadataFor(decodeURI(link));
                    if (!target) {
                        // All of this is so, so wrong; is this still even a valid contingency?
                        let dirname = path.dirname(filePath);
                        let prefix = '';
                        if (dirname && dirname !== '.') {
                            prefix = dirname.replace(/^\.\//, '');
                        }
                        let fullerPath = prefix? prefix + path.sep + link : link;
                        target = transformer.siteMap.getMetadataFor(decodeURI(fullerPath));
                    }
                    if (!target) {
                        return link.replace(/\.md$/, ".html"); // if not mapped, assume html
                    } else {
                        return target[0].target;
                    }
                }
            }
        ).use(markdownReplaceLink)

        const html = mdp.render(contents.body);

        await fs.writeFile(newFilePath, ejs.render(template, {metadata: contents.attributes, content: html}));
    }
}

module.exports = PlainMarkdownTransformer;
