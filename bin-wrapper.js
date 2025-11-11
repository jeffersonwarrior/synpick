#!/usr/bin/env node

const path = require('path');
const { createRequire } = require('module');

// Get the package directory
const packageDir = path.dirname(__dirname);
const mainScript = path.join(packageDir, 'dist', 'cli', 'index.js');

// Create a require function that resolves from the package directory
const requireFromPackage = createRequire(packageDir);

// Preload required modules by resolving them from the package directory
try {
  requireFromPackage('ink');
  requireFromPackage('commander');
  requireFromPackage('chalk');
  requireFromPackage('react');
  requireFromPackage('axios');
  requireFromPackage('zod');
} catch (error) {
  console.error('Missing dependencies. Please run: npm install');
  process.exit(1);
}

// Run the main script
require(mainScript);