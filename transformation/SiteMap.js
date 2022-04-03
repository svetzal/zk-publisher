class SiteMap {
    constructor() {
        this.contentMap = {};
    }
    addNodeTarget(sourcePath, metadata) {
        let key = sourcePath; //encodeURI(sourcePath);
        if (key in this.contentMap) {
            this.contentMap[key].push(metadata);
        } else {
            this.contentMap[key] = [metadata];
        }
    }

    getMetadataFor(sourcePath) {
        return this.contentMap[sourcePath];
    }
}

module.exports = SiteMap;

/*

1. Catalog files & plan transformations

    contentMap {
        "sourcePath": [
            {
                target: "path",
                type: "",
                tags: ["abc", "def"]
            },
        ]
    }

2. Transform files
    a. rewrite links in markdowns to target types
        https://www.npmjs.com/package/markdown-it-replace-link

 */