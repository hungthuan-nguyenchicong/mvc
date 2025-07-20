// ./root.js
import path from 'path';
const currentDir = import.meta.dir;
const ROOT = path.join(currentDir, '..');

console.log(ROOT);