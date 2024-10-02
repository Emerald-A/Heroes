import fs from 'fs';

export const avatarsData = JSON.parse(fs.readFileSync(`${__dirname.split('config')[0]}_data/avatars.json`, 'utf-8'));
