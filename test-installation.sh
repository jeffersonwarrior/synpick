#!/bin/bash

echo "=== Testing Synclaude Installation ==="

echo "1. Environment information:"
echo "Node.js version: $(node --version)"
echo "npm version: $(npm --version)"
echo "User: $(whoami)"
echo "Home directory: $HOME"
echo "PATH: $PATH"
echo "npm prefix: $(npm config get prefix)"
echo "npm global prefix: $(npm config get globalprefix)"
echo ""

echo "2. Installing synclaude from GitHub..."
npm install -g https://github.com/jeffersonwarrior/synclaude.git

echo ""
echo "3. Checking installation status..."
echo "npm list -g synclaude:"
npm list -g synclaude

echo ""
echo "4. Checking if command is available..."
echo "which synclaude:"
which synclaude

echo ""
echo "5. Testing synclaude command..."
echo "synclaude --version:"
synclaude --version

echo ""
echo "6. Testing help command..."
echo "synclaude --help:"
synclaude --help

echo ""
echo "7. Checking package.json bin mapping..."
echo "npm list -g --depth=0:"
npm list -g --depth=0

echo ""
echo "8. Checking linked files..."
echo "ls -la ~/.npm-global/bin/ | grep synclaude:"
ls -la ~/.npm-global/bin/ | grep synclaude || echo "No synclaude found in ~/.npm-global/bin/"

echo ""
echo "9. Testing basic functionality..."
echo "synclaude doctor:"
synclaude doctor || echo "Doctor command failed"

echo ""
echo "10. Installation test complete."