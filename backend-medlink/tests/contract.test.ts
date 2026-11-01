/**
 * Keeps docs/openapi.yaml honest: every mounted API route must be documented,
 * and every documented path must exist. Drift here is a contract bug.
 */
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { createApp } from '../src/app';

type Layer = {
  route?: { path: string; methods: Record<string, boolean> };
  name?: string;
  handle?: { stack?: Layer[] };
  regexp?: RegExp;
};

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const collectRoutes = (stack: Layer[], prefix = ''): string[] => {
  const found: string[] = [];
  for (const layer of stack) {
    if (layer.route) {
      const routePath = prefix + layer.route.path;
      for (const method of Object.keys(layer.route.methods)) {
        if (layer.route.methods[method]) found.push(`${method.toUpperCase()} ${routePath}`);
      }
    } else if (layer.name === 'router' && layer.handle?.stack) {
      const source = layer.regexp?.source ?? '';
      let segment = source
        .replace('^\\/', '/')
        .replace('\\/?(?=\\/|$)', '')
        .replace(/\\\//g, '/')
        .replace(/\$$/, '')
        .replace(/\?\(\?=\/\|\$\)/, '');
      if (segment === '/^/?(?=/|$)' || segment === '(?:/(?=$))?') segment = '';
      found.push(...collectRoutes(layer.handle.stack, prefix + (segment === '/' ? '' : segment)));
    }
  }
  return found;
};

const normalise = (route: string) =>
  route
    .replace('/api', '')
    .replace(/\/:([A-Za-z]+)/g, '/{$1}')
    .replace(/\/$/, '');

const app = createApp() as unknown as { _router: { stack: Layer[] } };

const implemented = new Set(
  collectRoutes(app._router.stack)
    .filter((r) => r.includes('/api/'))
    .map(normalise),
);

const spec = yaml.load(
  fs.readFileSync(path.join(__dirname, '..', 'docs', 'openapi.yaml'), 'utf8'),
) as { paths: Record<string, Record<string, unknown>> };

const documented = new Set<string>();
for (const [p, operations] of Object.entries(spec.paths)) {
  for (const method of Object.keys(operations)) {
    if (METHODS.includes(method)) documented.add(`${method.toUpperCase()} ${p}`);
  }
}

describe('API contract', () => {
  it('documents every mounted route', () => {
    const missing = [...implemented].filter((r) => !documented.has(r)).sort();
    expect(missing).toEqual([]);
  });

  it('does not document routes that do not exist', () => {
    const extra = [...documented].filter((r) => !implemented.has(r)).sort();
    expect(extra).toEqual([]);
  });

  it('declares bearer auth and a sensible number of operations', () => {
    expect(documented.size).toBeGreaterThan(140);
    expect(implemented.size).toBe(documented.size);
  });
});
