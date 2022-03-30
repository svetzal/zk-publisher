const path = require('path');
const fs = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const frontMatter = require('front-matter');
const changeFileExtensionTo = require("../pathManipulation/changeFileExtensionTo");

function canProcess(contents) {
    return ("type" in contents.attributes) && contents.attributes.type === 'presentation';
}

async function powerpointTransformer(filePath, source, output) {
    const raw = await fs.readFile(path.join(source, filePath));
    const contents = frontMatter(raw.toString());

    if (!canProcess(contents)) return;

    const infile = path.join(source, filePath);
    const innerpath = path.dirname(filePath);
    const outfile = path.join(path.resolve(output), innerpath, changeFileExtensionTo(path.basename(filePath), "pptx"));
    await exec(`cd ${path.dirname(infile)} && pandoc "${path.basename(infile)}" -o "${outfile}"`);
}

module.exports = powerpointTransformer;