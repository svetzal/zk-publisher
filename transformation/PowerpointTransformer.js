const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

const Transformer = require("./Transformer");

class PowerpointTransformer extends Transformer {
    canProcessWithContents(contents) {
        return this.isTypeAttributeSetTo(contents, 'presentation');
    }

    getNewExtension() {
        return "pptx";
    }

    async transform(filePath, source, output) {
        const fullTemplatePathname = this.getFullTemplatePathname();
        const pathToInfile = path.join(source, filePath);

        let newFilePath = this.calculateOutputFilePath(filePath, output, this.getNewExtension());
        await prepareOutputDirectory(path.dirname(newFilePath));

        await exec(`cd ${path.dirname(pathToInfile)} && pandoc "${path.basename(pathToInfile)}" --reference-doc ${fullTemplatePathname} -o "${newFilePath}"`);
    }
}

module.exports = PowerpointTransformer;