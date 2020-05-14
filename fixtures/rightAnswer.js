import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const path = require('path');
export const dirPath1 = path.join(__dirname, '/before.json');
export const dirPath2 = path.join(__dirname, '/after.json');

export const expected = '{\n + verbose: true\n host: hexlet.io\n + timeout: 20\n - timeout: 50\n - proxy: 123.234.53.22\n - follow: false\n}';