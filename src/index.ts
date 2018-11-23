#!/usr/bin/env node
import * as program from 'commander';
import upload from './scripts/upload';
import * as buckets from './scripts/buckets';
import * as hostnames from './scripts/hostnames';
import * as object from './scripts/object';
import * as login from './scripts/login';
import { refresh } from './scripts/refresh';

const packageJson = require('../package.json') as any;

program.version(packageJson.version);

program
  .command('upload [dirs...]')
  .description('upload files with glob string or file path')
  .option('-p, --prefix <prefix>', 'setting your upload files prefix')
  .option('-f, --force', 'force to overwrite file')
  .action((dirs, options) => {
    upload({
      glob: dirs,
      basePath: options.prefix,
      force: options.force,
    })
  })
program
  .command('buckets')
  .description('show all buckets in your qiniu cdn')
  .action(() => {
    buckets.list();
  })

program
  .command('hosts')
  .description('show all host map to your bucket, bucket is option')
  .action((sub) => {
    // 在有子命令的时候 sub会是一个string，没有子命令，sub会是一个对象
    if (typeof sub === 'string') {
      hostnames.fetchHosts(sub);
    } else {
      hostnames.fetchHosts();
    }
  })

program
  .command('refresh')
  .description('qiniu storage cache refresh')
  .action(() => {
    refresh();
  })

const objects = program
  .command('objects [operation]')
  .description('qiniu storage object operations')
  .action(function(operation) {
    switch(operation) {
      case 'stats':
        return object.stats();
      case 'move':
        return object.move();
      case 'copy':
        return object.copy();
      case 'delete':
        return object.del();
      default:
        objects
          .help(origin => {
            const operatons = {
              stats: 'Query object stats',
              move: 'Move object from origin bucket and key to target bucket and key',
              copy: 'Copy object from origin bucket and key to target bucket and key',
              delete: 'Delete object with target and key',
            } as { [k: string]: string };
            origin += '\n  Operations:\n\n';
            Object.keys(operatons).forEach((k: string) => {
              origin += `    ${k}   ${operatons[k]} \n\n`
            })
            return origin;
          })
    }
  })

program
  .command('login')
  .description('login qiniu (reset qiniu access token and secrect token)')
  .action(() => {
    login.reset();
  })

const result = program.parse(process.argv);

if (result.args.length == 0) {
  program.help();
} else if (result.args.filter(i => typeof i ==='string').length === result.args.length) {
  program.help();
}
