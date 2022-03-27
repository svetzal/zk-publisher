const expect = require('chai').expect;
const makeRelativeTo = require('./makeRelativeTo');

describe("makeRelativeTo should", function() {
    it("throw if root doesn't start with separator", function() {
        expect(() => makeRelativeTo("/one/filename","one")).to.throw("root (one) does not start with /")
    })

    it("throw if path doesn't start with separator", function() {
        expect(() => makeRelativeTo("one/filename", "/one")).to.throw("filePath (one/filename) does not start with /");
    })

    it("throw if path doesn't start with root", function() {
        expect(() => makeRelativeTo("/abc", "/def")).to.throw("path (/abc) is not within root (/def)")
    })

    it("throw if filePath isn't subpath of root", function() {
        expect(() => makeRelativeTo("/abc123", "/abc")).to.throw("relative path (/abc123) does not start with /");
    })

    it("strip root from filePath", function() {
        expect(makeRelativeTo("/abc/123/456.txt", "/abc")).to.equal("123/456.txt");
    })
});