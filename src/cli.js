#!/usr/bin/env node
import { Command } from 'commander';
import fs from 'fs'

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
        // Step 1: Check if .env.example exists in local file system (for now)
        if (!fs.existsSync('.env.example')) {
            console.error('No \'.env.example\' found in this project. Create a template to get started');
            process.exit(1);
        }

        // Step 2: Load variables from .env.example
        const exampleContent = fs.readFileSync('.env.example', 'utf8');
        const exampleVars = dotenv.parse(exampleContent);

        // Step 3: If .env does not exist OR --force is passed → create/overwrite it
        if (!fs.existsSync('.env') || options.force) {
            fs.writeFileSync('.env', exampleContent, 'utf8');
            console.log(options.force
                ? 'Overwrote existing .env with .env.example'
                : 'Created new .env from .env.example'
            );
            return;
        }

        // Step 4: If .env exists → compare and warn about missing keys
        const envContent = fs.readFileSync('.env', 'utf8');
        const envVars = dotenv.parse(envContent);

        const missingKeys = Object.keys(exampleVars).filter(
            (key) => !(key in envVars)
        );

        if (missingKeys.length > 0) {
            console.log('Your .env is missing the following keys:');
            missingKeys.forEach((k) => console.log(`   - ${k}`));
        } else {
            console.log('Your .env already contains all keys from .env.example');
        }
    });

// `push` command (basic template)
program
    .command('push')
    .description('Push your local .env to the source')
    .option('-b, --backup', 'Create a backup before pushing')
    .option('-s, --source <path>', 'Specify the destination of the env file (default: remote)')
    .action((options) => {
        console.log('Running envsync push...');

        // Step 1: Ensure .env exists
        if (!fs.existsSync('.env')) {
            console.error('No .env file found to push.');
            process.exit(1);
        }

        const envContent = fs.readFileSync('.env', 'utf8');

        // Step 2: Handle backup option
        if (options.backup) {
            const backupPath = `.env.backup.${Date.now()}`;
            fs.writeFileSync(backupPath, envContent, 'utf8');
            console.log(`Backup created at ${backupPath}`);
        }

        // Step 3: "Push" to source (for now, just write to a file or simulate remote)
        const dest = options.source || 'remote.env';
        fs.writeFileSync(dest, envContent, 'utf8');
        console.log(`.env successfully pushed to ${dest}`);
    });

// Display help if no arguments are passed
program.parse(process.argv);
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
