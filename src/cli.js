#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

// tool description (run 'envsync')
program
    .name('envsync')
    .description('A CLI tool that helps you keep your env vars consistent across environments')
    .version('1.0.0');

// `pull` command to sync env vars from a source
program
    .command('pull')
    .description('Pull latest .env from source and merge with your local')
    .option('-f, --force', 'Force overwrite local .env without prompting')
    .option('-s, --source <path>', 'Specify the source of the env file (default: remote)')
    .action((options) => {
        console.log('Running envsync pull...');
        if (options.force) {
            console.log('Force mode enabled: local .env will be overwritten.');
        }
        if (options.source) {
            console.log(`Using source: ${options.source}`);
        }
        // link a script or some action here
    });

// `push` command to upload local env vars to the source
program
    .command('push')
    .description('Push your local .env to the source')
    .option('-b, --backup', 'Create a backup before pushing')
    .action((options) => {
        console.log('Running envsync push...');
        if (options.backup) {
            console.log('Backup enabled: saving current remote env before pushing.');
        }
        // link a script or some action here
    });

// Display help if no arguments are passed
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
