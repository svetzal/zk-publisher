function changeFileExtensionTo(filePath, newExtension) {
    if (!filePath.includes(".")) return filePath;

    const rootName = filePath.replace(/\.[^.]*$/, '');
    return rootName + "." + newExtension;
}

module.exports = changeFileExtensionTo;