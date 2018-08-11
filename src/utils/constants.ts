import { homedir } from 'os';
import { join } from 'path';

export const tokenfile = join(homedir(), '.qn-cli.json')
