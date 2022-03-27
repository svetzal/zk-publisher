const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function exportVaultToMarkdown(source, target) {
    await exec(`obsidian-export "${source}" "${target}"`);
}

module.exports = exportVaultToMarkdown;