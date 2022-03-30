const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

const Transformer = require("./transformer");

class PowerpointTransformer extends Transformer {
    canProcess(contents) {
        return ("type" in contents.attributes) && contents.attributes.type === 'presentation';
    }

    async transform(filePath, source, output) {
        const fullTemplatePathname = this.getFullTemplatePathname();
        const pathToInfile = path.join(source, filePath);

        let newFilePath = this.getNewFilepath(filePath, output, "pptx");
        await prepareOutputDirectory(path.dirname(newFilePath));

        await exec(`cd ${path.dirname(pathToInfile)} && pandoc "${path.basename(pathToInfile)}" --reference-doc ${fullTemplatePathname} -o "${newFilePath}"`);
    }
}

module.exports = PowerpointTransformer;