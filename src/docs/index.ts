import path from 'path';
import yaml from 'yaml';
import fs from 'fs';

const specsPath = path.join(__dirname, 'bundled-api.yaml');
const fileContents = fs.readFileSync(specsPath, 'utf8');
const specsObject = yaml.parse(fileContents);

export { specsPath, specsObject };
