const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Transformer = require("./Transformer");
const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

class WordTransformer extends Transformer {
    canProcessWithContents(contents) {
        return this.isTypeAttributeSetTo(contents, 'document');
    }

    getNewExtension() {
        return "docx";
    }

    async transform(filePath, source, output) {
        const pathToInfile = path.join(source, filePath);
        const newFilePath = this.calculateOutputFilePath(filePath, output, this.getNewExtension());
        await prepareOutputDirectory(path.dirname(newFilePath));

        await exec(`cd ${path.dirname(pathToInfile)} && pandoc "${path.basename(pathToInfile)}" -o "${newFilePath}"`);
    }
}

module.exports = WordTransformer;