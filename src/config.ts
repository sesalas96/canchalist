import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Determine the environment
const env: string = process.env.NODE_ENV || 'dev';

// Load YAML config based on NODE_ENV
const configPath = path.join(__dirname, '../src/config', `${env}.yaml`);
const config = yaml.load(fs.readFileSync(configPath, 'utf8')) as Record<string, any>;

// Load any .env variables into the config object only here
config.API_BASE_URL = process.env.API_BASE_URL;

// Set the port
config.port = Number(process.env.PORT) || Number(config.port) || 3000;

export default config;
