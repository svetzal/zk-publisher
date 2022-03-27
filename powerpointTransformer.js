const path = require('path');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const frontMatter = require('front-matter');
const changeFileExtensionTo = require("./changeFileExtensionTo");

function canProcess(contents) {
    if (("type" in contents.attributes) && contents.attributes.type === 'presentation') return true;
    return false;
}

async function powerpointTransformer(filePath, source, output) {
    const raw = await fs.readFile(path.join(source, filePath));
    const contents = frontMatter(raw.toString());

    if (!canProcess(contents)) return;

    const infile = path.join(source, filePath);
    const outfile = path.join(output, changeFileExtensionTo(filePath, "pptx"));
    await exec(`pandoc "${infile}" -o "${outfile}"`);
}

module.exports = powerpointTransformer;