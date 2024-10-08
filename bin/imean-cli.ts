#!/usr/bin/env node
import { Command } from 'commander';
import { CommandLoader } from '../commands/command.loader';
import pkg from '../package.json';

const bootstrap = async () => {
  const program = new Command();

  program
    .version(pkg.version)
    .usage('<command> [options]')
    .helpOption('-h, --help', 'Output usage information.')
    .showSuggestionAfterError();

  await CommandLoader.load(program);

  await program.parseAsync(process.argv);
};

bootstrap();
