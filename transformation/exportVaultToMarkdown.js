const os = require('os');
const util = require('util');
const fs = require('fs');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

async function exportVaultToMarkdown(source, target, ignore= []) {
    const ignorePaths = ignore.map(i => path.resolve(path.join(source, i)));
    const ignoreFilePath = path.join(os.tmpdir(), "export-ignore");
    fs.writeFileSync(ignoreFilePath, ignorePaths.join("\n") + "\n");
    await exec(`obsidian-export "${source}" "${target}" --ignore-file "${ignoreFilePath}"`);
    fs.unlinkSync(ignoreFilePath);
}

module.exports = exportVaultToMarkdown;