#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

// tool description (run 'envsync')
program
    .name('envsync')
    .description('A CLI tool that helps you keep your env vars consistent across environments')
    .version('1.0.0')

program
    .command('envsync pull')
    .description('Pull latest .env from source and merge with your local')
    .action(()=>{
        // link a script or some action here
    })

program.parse(process.argv);
if(!process.argv.slice(2).length){
    program.outputHelp();
}