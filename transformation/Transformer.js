const path = require('path');
const fs = require('fs').promises;
const frontMatter = require('front-matter');
const changeFileExtensionTo = require("../pathManipulation/changeFileExtensionTo");

class Transformer {
    constructor(templateFilename = null) {
        this.templateFilename = templateFilename;
    }

    async getContents(filePath, source) {
        const raw = await fs.readFile(path.join(source, filePath));
        return frontMatter(raw.toString());
    }

    canProcessWithContents(contents) {
        return typeof (contents) !== "undefined";
    }

    async canProcess(filePath, source) {
        return filePath.endsWith(".md") && this.canProcessWithContents(await this.getContents(filePath, source));
    }

    async process(filePath, source, output) {
        if (await this.canProcess(filePath, source))
            await this.transform(filePath, source, output);
    }

    getNewExtension() {
        return "md";
    }

    async getMetadata(filePath, source) {
        if (await this.canProcess(filePath, source)) {
            return {
                target: this.calculateNewFileRelativePath(filePath, this.getNewExtension()),
                /*
                    type: "",
                    tags: ["abc", "def"]
                 */
            }
        } else
            return null;
    }

    async transform(filePath, source, output) {
    }

    getFullTemplatePathname() {
        return path.resolve(this.templateFilename);
    }

    async readFileToString(fullTemplatePathname) {
        return (await fs.readFile(fullTemplatePathname)).toString();
    }

    calculateOutputFilePath(filePath, output, newExtension) {
        return path.join(path.resolve(output), this.calculateNewFileRelativePath(filePath, newExtension));
    }

    calculateNewFileRelativePath(filePath, newExtension) {
        const innerPathToInfile = path.dirname(filePath);
        let newFilename = changeFileExtensionTo(path.basename(filePath), newExtension);
        return path.join(innerPathToInfile, newFilename);
    }

    isTypeAttributeSetTo(contents, typeValue) {
        return ("type" in contents.attributes) && contents.attributes.type === typeValue;
    }
}

module.exports = Transformer;