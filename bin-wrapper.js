#!/usr/bin/env node

const path = require('path');
const Module = require('module');

// Get the directory where this script is located
const scriptDir = __dirname;

// Find package.json to locate the package directory
let packageDir = scriptDir;
while (packageDir !== '/' && !require('fs').existsSync(path.join(packageDir, 'package.json'))) {
  packageDir = path.dirname(packageDir);
}

// Add the package's node_modules to the search paths
const nodeModulesPath = path.join(packageDir, 'node_modules');
if (require('fs').existsSync(nodeModulesPath)) {
  Module.globalPaths.push(nodeModulesPath);
}

// Set NODE_PATH to include the package's node_modules
const originalNodePath = process.env.NODE_PATH;
process.env.NODE_PATH = (originalNodePath ? originalNodePath + path.delimiter : '') + nodeModulesPath;

// Reset require cache to force re-resolution with new NODE_PATH
delete require.cache[require.resolve('module')];

// Run the main script
const mainScript = path.join(packageDir, 'dist', 'cli', 'index.js');
require(mainScript);