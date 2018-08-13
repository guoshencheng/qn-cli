#!/usr/bin/env node
import * as program from 'commander';
import upload from './scripts/upload';
import * as buckets from './scripts/buckets';
import * as hostnames from './scripts/hostnames';
import * as object from './scripts/object';

const packageJson = require('../package.json') as any;

program.version(packageJson.version);

program
  .command('upload [dirs...]')
  .description('upload files with glob string or file path')
  .option('-p, --prefix <prefix>', 'setting your upload files prefix')
  .action((dirs, options) => {
    upload({
      glob: dirs,
      basePath: options.prefix
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

const objects = program
  .command('objects [operation]')
  .description('qiniu storage object operations')
  .action(function(operation) {
    switch(operation) {
      case 'stats':
        object.stats();
      default:
      objects.help();
    }
  })

const result = program.parse(process.argv);

if (result.args.length == 0) {
  program.help();
} else if (result.args.filter(i => typeof i ==='string').length === result.args.length) {
  program.help();
}
