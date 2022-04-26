const path = require('path');
const {readdir} = require('fs').promises;

async function* filePathsIn(dir, ignore = []) {
    const items = await readdir(dir, {withFileTypes: true});
    for (const item of items) {
        if (!ignore.reduce((acc, i) => acc || item.name.startsWith(i), false)
        && item.name !== '.export-ignore') {
            const filePath = path.resolve(dir, item.name);
            if (item.isDirectory()) {
                yield* filePathsIn(filePath);
            } else
                yield filePath;
        }
    }
}

module.exports = filePathsIn;