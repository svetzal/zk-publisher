#!/usr/bin/env node

const path = require("path");

const prepareOutputDirectory = require('./pathManipulation/prepareOutputDirectory');
const runContentTransformers = require('./transformation/runContentTransformers');
const exportVaultToMarkdown = require("./transformation/exportVaultToMarkdown");
const PlainMarkdownTransformer = require("./transformation/PlainMarkdownTransformer");
const PowerpointTransformer = require("./transformation/PowerpointTransformer");
const WordTransformer = require("./transformation/WordTransformer");
const CopyTransformer = require("./transformation/CopyTransformer");
const SiteMap = require("./transformation/SiteMap");
const buildSiteMap = require("./build-content-map");
const prepareSiteMap = require("./transformation/prepareSiteMap");

const main = async () => {
    const args = require('yargs')
        .option('s', {
            alias: 'source',
            required: true,
            description: 'source directory containing your Obsidian Vault',
        })
        .option('o', {
            alias: 'output',
            default: 'output',
            description: 'output directory for generated files',
        })
        .option('t', {
            alias: 'temp',
            description: 'directory to use for temporary files',
            default: 'temp',
        })
        .option('htmlTemplate', {
            description: 'default HTML template, in EJS format',
            default: 'defaultHtmlTemplate.ejs'
        })
        .option('pptxTemplate', {
            description: 'default Powerpoint template, pptx or potx',
            default: 'defaultPptxTemplate.pptx'
        })
        .help().argv;

    let siteMap = new SiteMap();
    const transformers = [
        new PlainMarkdownTransformer(args.htmlTemplate, siteMap),
        new PowerpointTransformer(args.pptxTemplate),
        new WordTransformer(),
        new CopyTransformer()
    ];

    await prepareOutputDirectory(args.output);
    await prepareOutputDirectory(args.temp);
    await exportVaultToMarkdown(args.source, args.temp);
    await buildSiteMap(siteMap, path.resolve(args.temp), args.output, transformers);
    await prepareSiteMap(siteMap, path.resolve(args.temp), args.output, transformers);
    await runContentTransformers(siteMap, path.resolve(args.temp), args.output, transformers);
};

main();
