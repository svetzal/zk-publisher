#!/usr/bin/env node

const path = require("path");

const prepareOutputDirectory = require('./pathManipulation/prepareOutputDirectory');
const runContentTransformers = require('./transformation/runContentTransformers');
const exportVaultToMarkdown = require("./transformation/exportVaultToMarkdown");
const PlainMarkdownTransformer = require("./transformation/plainMarkdownTransformer");
const PowerpointTransformer = require("./transformation/powerpointTransformer");

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

    const transformers = [
        new PlainMarkdownTransformer(args.htmlTemplate),
        new PowerpointTransformer(args.pptxTemplate),
    ];

    await prepareOutputDirectory(args.output);
    await prepareOutputDirectory(args.temp);
    await exportVaultToMarkdown(args.source, args.temp);
    await runContentTransformers(path.resolve(args.temp), args.output, transformers);
};

main();
