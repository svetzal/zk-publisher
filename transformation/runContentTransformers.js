const filePathsIn = require('../pathManipulation/filePathsIn');
const makeRelativeTo = require('../pathManipulation/makeRelativeTo');

async function runContentTransformers(siteMap, source, output, transformers, ignore) {
    for await (const filePath of filePathsIn(source, ignore)) {
        let relativePath = makeRelativeTo(filePath, source);
        for (const transformer of transformers) {
            await transformer.process(relativePath, source, output);
        }
    }
}

module.exports = runContentTransformers;