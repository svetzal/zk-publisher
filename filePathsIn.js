const path = require('path');
const {readdir} = require('fs').promises;

async function* filePathsIn(dir) {
    const items = await readdir(dir, {withFileTypes: true});
    for (const item of items) {
        const filePath = path.resolve(dir, item.name);
        if (item.isDirectory()) {
            yield* filePathsIn(filePath);
        } else if (filePath.endsWith(".md")) {
            yield filePath;
        }
    }
}

module.exports = filePathsIn;