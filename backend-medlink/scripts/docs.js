/* Validates docs/openapi.yaml and prints where the explorer is served. */
const fs = require('fs');
const yaml = require('js-yaml');

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

try {
  const spec = yaml.load(fs.readFileSync('docs/openapi.yaml', 'utf8'));
  const operations = Object.values(spec.paths).reduce(
    (total, path) => total + Object.keys(path).filter((m) => METHODS.includes(m)).length,
    0,
  );
  const port = process.env.PORT || 5000;
  const docsPath = process.env.SWAGGER_PATH || '/docs';

  console.log(`spec        OK  (openapi ${spec.openapi}, ${Object.keys(spec.paths).length} paths, ${operations} operations)`);
  console.log(`tags        ${spec.tags.map((t) => t.name).join(', ')}`);
  console.log(`swagger ui  http://localhost:${port}${docsPath}`);
  console.log(`spec json   http://localhost:${port}${docsPath}/openapi.json`);
} catch (err) {
  console.error('spec INVALID:', err.message);
  process.exit(1);
}
