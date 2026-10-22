import { createServer, type Server } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';

interface HeaderRule {
  path: string;
  headers: Record<string, string>;
}

const TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.geojson': 'application/geo+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

/** Cloudflare Pages `_headers`: later matching rules override the same header name. */
export function parseHeaders(text: string): HeaderRule[] {
  const rules: HeaderRule[] = [];
  let current: HeaderRule | null = null;
  for (const line of text.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (line.startsWith(' ') || line.startsWith('\t')) {
      if (!current) continue;
      const split = line.indexOf(':');
      if (split === -1) continue;
      current.headers[line.slice(0, split).trim()] = line.slice(split + 1).trim();
    } else {
      current = { path: line.trim(), headers: {} };
      rules.push(current);
    }
  }
  return rules;
}

function ruleMatches(pattern: string, pathname: string): boolean {
  if (pattern.endsWith('*')) return pathname.startsWith(pattern.slice(0, -1));
  return pattern === pathname;
}

export function headersFor(rules: HeaderRule[], pathname: string): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const rule of rules) {
    if (ruleMatches(rule.path, pathname)) Object.assign(headers, rule.headers);
  }
  return headers;
}

export function startHeadersServer(dist = path.resolve('dist')): Promise<{ port: number; close: () => Promise<void> }> {
  const rules = parseHeaders(readFileSync(path.join(dist, '_headers'), 'utf8'));
  const server: Server = createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
    const headers = headersFor(rules, pathname);
    const file = resolveFile(dist, pathname);
    if (!file) {
      response.writeHead(404, headers);
      response.end('Not found');
      return;
    }
    const body = readFileSync(file);
    const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
    response.writeHead(200, { 'Content-Type': type, ...headers });
    response.end(body);
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      resolve({
        port,
        close: () =>
          new Promise((done, fail) => {
            server.close((error) => (error ? fail(error) : done()));
          }),
      });
    });
  });
}

function resolveFile(dist: string, pathname: string): string | undefined {
  const root = path.resolve(dist);
  const rel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const full = path.resolve(root, rel);
  if (full !== root && !full.startsWith(root + path.sep)) return undefined;
  if (existsSync(full) && statSync(full).isFile()) return full;
  if (path.extname(rel)) return undefined;
  return path.join(root, 'index.html');
}
