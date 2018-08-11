import chalk from 'chalk';

export const hostnames = (value: string[], bucket?: string) => {
  console.log(`\n fetched hostnames map to ${bucket || 'this bucket'}`)
  value.forEach(hostname => {
    console.log(`*  ${hostname}`);
  })
  console.log('\n');
}

export const basePathWarning = () => {
  console.log('===========================================');
  console.log('**                WARNING                **');
  console.log('===========================================');
  console.log(chalk.yellow('use \'\' as basePath is not strict. '));
  console.log(chalk.yellow('  file will be mounted at root of your host.'));
  console.log(chalk.yellow('  for example:'));
  console.log(chalk.yellow('  if your file name is \'src/index.js\' and the hostname is img.qn-cli-com'));
  console.log(chalk.yellow('  the result will be http://img.qn-cli-com/src/index.js'));
  console.log(chalk.yellow('someone may overwrite this file by mistake'));
  console.log('===========================================');
}
