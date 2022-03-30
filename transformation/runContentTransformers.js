const filePathsIn = require('../pathManipulation/filePathsIn');
const makeRelativeTo = require('../pathManipulation/makeRelativeTo');

async function runContentTransformers(source, output, transformers) {
    let contentMap = {};
    for await (const filePath of filePathsIn(source)) {
        let relativePath = makeRelativeTo(filePath, source);
        for (const transform of transformers) {
            await transform(relativePath, source, output);
        }
        contentMap[relativePath] = {};
    }
}

module.exports = runContentTransformers;

/*

1. Catalog files & plan transformations

    contentMap {
        "sourcePath": {
            transformations: [
                function: () => {},
                target: "path",
                type: "",
                tags: ["abc", "def"]
            ]
        }
    }

2. Transform files
    a. rewrite links in markdowns to target types
        https://www.npmjs.com/package/markdown-it-replace-link

 */