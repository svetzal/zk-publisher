const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const Transformer = require("./transformer");
const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

class WordTransformer extends Transformer {
    canProcess(contents) {
        return this.typeAttributeSetTo(contents, 'document');
    }

    async transform(filePath, source, output) {
        const pathToInfile = path.join(source, filePath);
        const newFilePath = this.getNewFilepath(filePath, output, 'docx');
        await prepareOutputDirectory(path.dirname(newFilePath));

        await exec(`cd ${path.dirname(pathToInfile)} && pandoc "${path.basename(pathToInfile)}" -o "${newFilePath}"`);
    }
}

module.exports = WordTransformer;