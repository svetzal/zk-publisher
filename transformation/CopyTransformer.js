const fs = require("fs");
const path = require("path");
const Transformer = require("./Transformer");
const prepareOutputDirectory = require("../pathManipulation/prepareOutputDirectory");

class CopyTransformer extends Transformer {
    async canProcess(filePath, source) {
        return !filePath.endsWith('.md');
    }

    async transform(filePath, source, output) {
        let fullInputPath = path.join(source, filePath);
        let fullOutputPath = path.join(output, filePath);
        await prepareOutputDirectory(path.dirname(fullOutputPath));
        fs.copyFileSync(fullInputPath, fullOutputPath);
    }
}

module.exports = CopyTransformer;