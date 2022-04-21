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
                    if (link.match(/^(https?|mailto):\/\//)) return link;

                    const decodedLink = decodeURIComponent(link);
                    const decodedPath = path.join(path.dirname(filePath), decodedLink);
                    const target = transformer.siteMap.getMetadataFor(decodedPath);

                    let foundTarget;
                    if (!target) {
                        // If the target isn't mapped, just use the link as provided
                        foundTarget = decodedLink;
                    } else {
                        // Figure out the relative path between the current document and the linked target
                        const targetPath = target[0].target;
                        const p1 = path.resolve(path.join(output, path.dirname(filePath)));
                        const p2 = path.resolve(path.join(output, path.dirname(targetPath)));
                        foundTarget = path.join(path.relative(p1, p2), path.basename(targetPath));
                    }

                    return encodeURI(foundTarget);
                }
            }
        ).use(markdownReplaceLink)

        const html = mdp.render(contents.body);

        await fs.writeFile(newFilePath, ejs.render(template, {metadata: contents.attributes, content: html, title: path.basename(filePath)}));
    }
}

module.exports = PlainMarkdownTransformer;
