import { readFileSync, writeFileSync } from 'fs'
import { tokenfile } from './constants';
import * as inquirer from 'inquirer';

export interface Token {
  ak: string;
  sk: string;
}

export const askTokens = (): Promise<Token> => {
  return inquirer.prompt([{
    name: 'ak',
    message: 'enter your qiniu access token?'
  }, {
    name: 'sk',
    message: 'enter your qiniu secrect token?'
  }])
}

export const checkTokens = async (): Promise<Token> => {
  let tokens;
  try {
    tokens = JSON.parse(readFileSync(tokenfile, 'utf8')) as Token;
  } catch(e) {
    tokens = await askTokens();
    writeFileSync(tokenfile, JSON.stringify(tokens), 'utf8');
  }
  return tokens;
}
