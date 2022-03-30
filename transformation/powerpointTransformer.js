const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const changeFileExtensionTo = require("../pathManipulation/changeFileExtensionTo");
const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

const Transformer = require("./transformer");

class PowerpointTransformer extends Transformer {
    canProcess(contents) {
        return ("type" in contents.attributes) && contents.attributes.type === 'presentation';
    }

    async transform(filePath, source, output) {
        const templateFile = path.resolve('defaultPptxTemplate.pptx');

        const infile = path.join(source, filePath);
        const innerPath = path.dirname(filePath);
        const outfile = path.join(path.resolve(output), innerPath, changeFileExtensionTo(path.basename(filePath), "pptx"));
        await prepareOutputDirectory(path.join(path.resolve(output), innerPath));
        await exec(`cd ${path.dirname(infile)} && pandoc "${path.basename(infile)}" --reference-doc ${templateFile} -o "${outfile}"`);
    }
}

module.exports = PowerpointTransformer;