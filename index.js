'use strict';

const path = require('path');
const Command = require('common-bin');


// replace your own project name with ProjectCli
class ProjectCli extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.usage = 'Usage: project-cli [command] [options]';
    this.parserOptions = {
      execArgv: true,
      removeAlias: true,
    };

    // load directory
    this.load(path.join(__dirname, 'lib/cmd'));
  }
}

module.exports = exports = ProjectCli;