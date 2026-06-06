import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../');
const LOG_FILE = path.join(ROOT, 'logs.txt');

const write = (line) => fs.appendFileSync(LOG_FILE, line + '\n');

// Remove null/undefined fields and replace base64 blobs with a placeholder
const sanitize = (body) => {
  if (!body || typeof body !== 'object') return body;

  return Object.fromEntries(
    Object.entries(body)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => [k, k === 'meal_image_base64' ? '[BASE64 IMAGE]' : v])
  );
};

export const logRequest = (method, route, body) => {
  const payload = sanitize(body);
  const mediaType = payload?.meal_media_type ?? 'N/A';

  write(`\n[${new Date().toISOString()}] REQUEST  ${method} ${route}`);
  write(`media_type : ${mediaType}`);
  write(`Payload    : ${JSON.stringify(payload)}`);
};

export const logResponse = (method, route, elapsedMs, payload) => {
  write(`[${new Date().toISOString()}] RESPONSE ${method} ${route} (${elapsedMs}ms)`);
  write(`Payload    : ${JSON.stringify(payload)}`);
  write('---');
};

export const logError = (method, route, elapsedMs, error) => {
  write(`[${new Date().toISOString()}] ERROR    ${method} ${route} (${elapsedMs}ms)`);
  write(`Message    : ${error.message}`);
  write(`Stack      : ${error.stack ?? 'N/A'}`);
  write('---');
};
