#!/usr/bin/env node
import * as program from 'commander';
import upload from './scripts/upload';
import * as buckets from './scripts/buckets';
import * as hostnames from './scripts/hostnames';

const packageJson = require('../package.json') as any;

program.version(packageJson.version);

program
  .command('upload [dirs...]')
  .action((dirs) => {
    upload({
      glob: dirs
    })
  })
program
  .command('buckets')
  .action(() => {
    buckets.list();
  })

program
  .command('hosts')
  .action((sub) => {
    // 在有子命令的时候 sub会是一个string，没有子命令，sub会是一个对象
    if (typeof sub === 'string') {
      hostnames.fetchHosts(sub);
    } else {
      hostnames.fetchHosts();
    }
  })
program.parse(process.argv);
