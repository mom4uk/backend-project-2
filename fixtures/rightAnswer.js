import { fileURLToPath } from 'url';
import path, { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const dirPath1ForJson = path.join(__dirname, '/before.json');
export const dirPath2ForJson = path.join(__dirname, '/after.json');

export const dirPath1ForYaml = path.join(__dirname, '/before.yaml');
export const dirPath2ForYaml = path.join(__dirname, '/after.yaml');

export const dirPath1ForIni = path.join(__dirname, '/before.ini');
export const dirPath2ForIni = path.join(__dirname, '/after.ini');

export const expected = '{\n + verbose: true\n host: hexlet.io\n + timeout: 20\n - timeout: 50\n - proxy: 123.234.53.22\n - follow: false\n}';
