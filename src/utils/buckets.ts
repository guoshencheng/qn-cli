import * as inquirer from 'inquirer';

export const askBuckets = (buckets: string[]): Promise<{ bucket: string }> => {
  return inquirer.prompt({
    message: 'please choose a bucket in your qiniu account?',
    name: 'bucket',
    type: 'list',
    choices: buckets,
  })
}
