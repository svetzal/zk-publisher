const expect = require('chai').expect;

const changeFileExgensionTo = require('./changeFileExtensionTo');

describe("changeFileExtensionTo should", function () {
    it("return input if no extension", function () {
        expect(changeFileExgensionTo("one")).to.equal("one");
    })

    it("should change an extension", function() {
        expect(changeFileExgensionTo("one.md", "html")).to.equal("one.html");
    })
});