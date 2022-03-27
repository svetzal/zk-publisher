const filePathsIn = require('../pathManipulation/filePathsIn');
const makeRelativeTo = require('../pathManipulation/makeRelativeTo');

async function runContentTransformers(source, output, transformers) {
    for await (const filePath of filePathsIn(source)) {
        for (const transform of transformers) {
            await transform(makeRelativeTo(filePath, source), source, output);
        }
    }
}

module.exports = runContentTransformers;