import fs from 'fs';

export const herosData = JSON.parse(fs.readFileSync(`${__dirname.split('config')[0]}_data/heros.json`, 'utf-8'));
