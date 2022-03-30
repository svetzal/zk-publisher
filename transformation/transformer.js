const path = require('path');
const fs = require('fs').promises;
const frontMatter = require('front-matter');

class Transformer {
    canProcess(contents) {
        return typeof(contents) !== "undefined";
    }

    async process(filePath, source, output) {
        const raw = await fs.readFile(path.join(source, filePath));
        this.contents = frontMatter(raw.toString());

        if (this.canProcess(this.contents))
            await this.transform(filePath, source, output);
    }

    async transform(filePath, source, output) {
    }
}

module.exports = Transformer;