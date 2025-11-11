#!/usr/bin/env node

const path = require('path');
const { createRequire } = require('module');

// Find the package.json to locate the actual package directory
let packageDir = __dirname;
while (packageDir !== '/' && !require('fs').existsSync(path.join(packageDir, 'package.json'))) {
  packageDir = path.dirname(packageDir);
}

const mainScript = path.join(packageDir, 'dist', 'cli', 'index.js');

// Create a require function that resolves from the package directory
const requireFromPackage = createRequire(mainScript);

// Run the main script directly - Node.js will resolve dependencies from the package
require(mainScript);