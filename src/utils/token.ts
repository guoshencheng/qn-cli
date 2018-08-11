import { readFileSync, writeFileSync } from 'fs'
import { tokenfile } from './constants';
import { askTokens } from './ask';

let cachedToken: Token;

export interface Token {
  ak: string;
  sk: string;
}

export const checkTokens = async (): Promise<Token> => {
  if (cachedToken) {
    return cachedToken;
  }
  try {
    cachedToken = JSON.parse(readFileSync(tokenfile, 'utf8')) as Token;
    return cachedToken;
  } catch(e) {
    return resetToken();
  }
}

export const resetToken = async (): Promise<Token> => {
  const token = await askTokens();
  writeFileSync(tokenfile, JSON.stringify(token), 'utf8');
  cachedToken = token;
  return token;
}
