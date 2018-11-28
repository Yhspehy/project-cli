'use strict';

const debug = require('debug')('project-cli');
const Command = require('common-bin');
const path = require('path');
const detect = require('detect-port');
const utils = require('../utils/index')

class DevCommand extends Command {
  constructor(rawArgv) {
    super(rawArgv);
    this.parserOptions = {
      execArgv: true,
      removeAlias: true,
    };
    this.usage = 'Usage: project-cli dev [options]';

    this.defaultPort = 8888;

    this.options = {
      baseDir: {
        description: 'directory of application, default to `process.cwd()`',
        type: 'string',
      },
      cluster: {
        description: 'numbers of app workers, if not provide then only 1 worker, provide without value then `os.cpus().length`',
        type: 'number',
        alias: 'c',
      },
      /**
       *
       * npm run dev -- -p=7777
       * or
       * node bin/project-cli.js dev -p=7777
       *
       */
      port: {
        description: 'listening port, default to 8888',
        type: 'number',
        alias: 'p',
      },
      require: {
        description: 'will add to execArgv --require',
        type: 'array',
        alias: 'r',
      },
    };
  }

  get description() {
    return 'Start server at local dev mode';
  }

  get context() {
    const context = super.context;
    const { argv, execArgvObj } = context;
    execArgvObj.require = execArgvObj.require || [];
    // add require to execArgv
    if (argv.require) {
      execArgvObj.require.push(...argv.require);
      argv.require = undefined;
    }
    return context;
  }

  async run(context) {
    const devArgs = await this.formatArgs(context);
    const env = {
      NODE_ENV: 'development'
    };
    const options = {
      execArgv: context.execArgv,
      env: Object.assign(env, context.env),
    };
    debug('%j %j, %j', devArgs, options.execArgv, options.env.NODE_ENV);
    utils.server(devArgs, options)
  }

  /**
   * @param {Object} context - { cwd, argv }
   * @return {Object} {"port":7001,"...}
   */
  async formatArgs(context) {
    const { cwd, argv } = context;
    /* istanbul ignore next */
    argv.baseDir = argv._[0] || argv.baseDir || cwd;
    /* istanbul ignore next */
    if (!path.isAbsolute(argv.baseDir)) argv.baseDir = path.join(cwd, argv.baseDir);

    argv.workers = argv.cluster || 1;
    argv.port = argv.port || argv.p;

    // remove unused properties
    argv.cluster = undefined;
    argv.c = undefined;
    argv.p = undefined;
    argv._ = undefined;
    argv.$0 = undefined;

    // auto detect available port
    if (!argv.port) {
      debug('detect available port');
      const port = await detect(this.defaultPort);
      if (port !== this.defaultPort) {
        argv.port = port;
        console.warn(`[project-cli] server port ${this.defaultPort} is in use, now using port ${port}\n`);
      } else {
        argv.port = port
      }
      debug(`use available port ${port}`);
    }
    return argv;
  }
}

module.exports = DevCommand;
