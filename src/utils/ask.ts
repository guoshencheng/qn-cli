import * as inquirer from 'inquirer';
import { Token } from './token';
import { basePathWarning } from './renderer';

export const askTokens = (): Promise<Token> => {
  return inquirer.prompt([{
    name: 'ak',
    message: 'Enter your qiniu access token?'
  }, {
    name: 'sk',
    message: 'Enter your qiniu secrect token?'
  }])
}

export const askBuckets = (buckets: string[]): Promise<{ bucket: string }> => {
  return inquirer.prompt({
    message: 'Please choose a bucket in your qiniu account?',
    name: 'bucket',
    type: 'list',
    choices: buckets,
  })
}

export const askBasePath = async(): Promise<string> => {
  basePathWarning();
  let result = await inquirer.prompt([{
    type: 'confirm',
    name: 'continue',
    message: 'Continue to use empty basePath ?'
  }]) as any
  if (result.continue) {
    return '';
  } else {
    result = await inquirer.prompt({
      name: 'basePath',
      message: 'Enter a base path (example: assets/qn/image )'
    }) as any;
    return result.basePath
  }
}
