import { readFileSync, writeFileSync } from 'fs'
import { tokenfile } from './constants';
import { askTokens } from './ask';

export interface Token {
  ak: string;
  sk: string;
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
