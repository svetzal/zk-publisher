const path = require('path');
const fs = require('fs').promises;
const frontMatter = require('front-matter');
const changeFileExtensionTo = require("../pathManipulation/changeFileExtensionTo");

class Transformer {
    constructor(templateFilename = null) {
        this.templateFilename = templateFilename;
    }

    canProcess(contents) {
        return typeof(contents) !== "undefined";
    }

    async process(filePath, source, output) {
        const raw = await fs.readFile(path.join(source, filePath));
        this.contents = frontMatter(raw.toString());

        if (this.canProcess(this.contents))
            await this.transform(filePath, source, output);
    }

    async transform(filePath, source, output) {
    }

    getFullTemplatePathname() {
        return path.resolve(this.templateFilename);
    }

    async readFileToString(fullTemplatePathname) {
        return (await fs.readFile(fullTemplatePathname)).toString();
    }

    getNewFilepath(filePath, output, newExtension) {
        const innerPathToInfile = path.dirname(filePath);
        let newFilename = changeFileExtensionTo(path.basename(filePath), newExtension);
        return path.join(path.resolve(output), innerPathToInfile, newFilename);
    }

    typeAttributeSetTo(contents, typeValue) {
        return ("type" in contents.attributes) && contents.attributes.type === typeValue;
    }
}

module.exports = Transformer;