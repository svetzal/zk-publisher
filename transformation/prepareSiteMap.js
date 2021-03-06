const filePathsIn = require("../pathManipulation/filePathsIn");
const makeRelativeTo = require("../pathManipulation/makeRelativeTo");

async function prepareSiteMap(siteMap, source, output, transformers, ignore) {
    for await (const filePath of filePathsIn(source, ignore)) {
        let relativePath = makeRelativeTo(filePath, source);
        for (const transformer of transformers) {
            const metadata = await transformer.getMetadata(relativePath, source, output);
            if (metadata) siteMap.addNodeTarget(relativePath, metadata);
        }
    }
}

module.exports = prepareSiteMap;