import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../');
const LOG_FILE = path.join(ROOT, 'logs.txt');

const write = (line) => fs.appendFileSync(LOG_FILE, line + '\n');

export const logRequest = (method, route, payload) => {
  write(`\n[${new Date().toISOString()}] REQUEST  ${method} ${route}`);
  write(`Payload  : ${JSON.stringify(payload)}`);
};

export const logResponse = (method, route, elapsedMs, payload) => {
  write(`[${new Date().toISOString()}] RESPONSE ${method} ${route} (${elapsedMs}ms)`);
  write(`Payload  : ${JSON.stringify(payload)}`);
  write('---');
};

export const logError = (method, route, elapsedMs, error) => {
  write(`[${new Date().toISOString()}] ERROR    ${method} ${route} (${elapsedMs}ms)`);
  write(`Message  : ${error.message}`);
  write(`Stack    : ${error.stack ?? 'N/A'}`);
  write('---');
};
