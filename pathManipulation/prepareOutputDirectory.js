const fs = require('fs').promises;

async function prepareOutputDirectory(output) {
    try {
        const stat = await fs.stat(output);
        if (!stat.isDirectory()) {
            throw(`output ${output} exists, but is not a directory`);
        }
    } catch (err) {
        if (err.code === "ENOENT") { // Not found
            await fs.mkdir(output, {recursive: true});
            return;
        }
        throw err;
    }
}

module.exports = prepareOutputDirectory;