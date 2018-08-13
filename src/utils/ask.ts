import * as inquirer from 'inquirer';
import * as autocomplete from 'inquirer-autocomplete-prompt';
import { Token, checkTokens } from './token';
import { basePathWarning } from './renderer';
import * as qiniu from 'qiniu';

export const askInputObjectKey = async (): Promise<{ [key: string]: string }> => {
  return inquirer.prompt({
    name: 'key',
    message: 'Enter your qiniu object key ?',
  }) as Promise<{ [key: string]: string }>
}

export const askObjectKey = async (bucket: string): Promise<{ [key: string]: string }> => {
  inquirer.registerPrompt('autocomplete', autocomplete);
  const { ak, sk } = await checkTokens();
  const mac = new qiniu.auth.digest.Mac(ak, sk);
  const qiniuConf = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConf);
  return inquirer.prompt({
    type: 'autocomplete',
    name: 'key',
    message: 'Select your qiniu object key ?',
    source: (_: any, input: string) => {
      return new Promise((resolve) => {
        bucketManager.listPrefix(bucket, {
          limit: 10,
          prefix: input,
        }, (err, _, info) => {
          if (err) {
            resolve([]);
          } else {
            resolve(info.data.items.map((item: any) => item.key));
          }
        })
      });
    }
  } as any) as any
}

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
