const path = require('path');

function makeRelativeTo(filePath, root) {
    if (root.substr(0, 1) != path.sep) throw `root (${root}) does not start with ${path.sep}`;
    if (filePath.substr(0,1) != path.sep) throw `filePath (${filePath}) does not start with ${path.sep}`;
    if (filePath.substr(0, root.length) != root) throw `path (${filePath}) is not within root (${root})`;
    if (filePath.substr(root.length, 1) != path.sep) throw `relative path (${filePath}) does not start with ${path.sep}`;
    return filePath.substr(root.length + 1);
}

module.exports = makeRelativeTo;