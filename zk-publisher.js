#!/usr/bin/env node

const prepareOutputDirectory = require('./prepareOutputDirectory');
const plainMarkdownTransformer = require('./plainMarkdownTransformer');
const powerpointTransformer = require("./powerpointTransformer");
const runContentTransformers = require('./run-content-transformers');
const exportVaultToMarkdown = require("./exportVaultToMarkdown");
const path = require("path");

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
        .help().argv;

    const transformers = [
        plainMarkdownTransformer,
        powerpointTransformer,
    ];

    await prepareOutputDirectory(args.output);
    await prepareOutputDirectory(args.temp);
    await exportVaultToMarkdown(args.source, args.temp);
    await runContentTransformers(path.resolve(args.temp), args.output, transformers);
};

main();
