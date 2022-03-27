#!/usr/bin/env node

const prepareOutputDirectory = require('./pathManipulation/prepareOutputDirectory');
const plainMarkdownTransformer = require('./transformation/plainMarkdownTransformer');
const powerpointTransformer = require("./transformation/powerpointTransformer");
const runContentTransformers = require('./transformation/runContentTransformers');
const exportVaultToMarkdown = require("./transformation/exportVaultToMarkdown");
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
