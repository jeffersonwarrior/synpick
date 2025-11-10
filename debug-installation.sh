#!/bin/bash

echo "=== Detailed Debugging of Synclaude Installation ==="

echo "1. Initial environment setup:"
echo "User: $(whoami)"
echo "Home: $HOME"
echo "Current directory: $(pwd)"
echo "PATH: $PATH"
echo ""

echo "2. npm configuration:"
echo "npm prefix: $(npm config get prefix)"
echo "npm global prefix: $(npm config get globalprefix)"
echo "npm config list:"
npm config list
echo ""

echo "3. Clear any existing installation:"
npm uninstall -g synclaude
rm -rf ~/.npm-global/bin/synclaude
rm -rf ~/.npm-global/lib/node_modules/synclaude
echo ""

echo "4. Install synclaude with verbose output:"
npm install -g https://github.com/jeffersonwarrior/synclaude.git --verbose
echo ""

echo "5. Check installation structure:"
echo "Contents of ~/.npm-global/:"
find ~/.npm-global -type f -name "*synclaude*" 2>/dev/null || echo "No synclaude files found in ~/.npm-global/"
echo ""

echo "6. Check npm global modules:"
echo "ls -la ~/.npm-global/lib/node_modules/:"
ls -la ~/.npm-global/lib/node_modules/ | grep -i synclaude || echo "No synclaude in node_modules"
echo ""

echo "7. Check if there's a bin directory:"
echo "ls -la ~/.npm-global/bin/ 2>/dev/null || echo 'No bin directory found'"
echo ""

echo "8. Check npm cache and temp directories:"
echo "Looking in npm cache for synclaude..."
find ~/.npm -name "*synclaude*" -type d 2>/dev/null | head -5
echo ""

echo "9. Check what npm thinks is installed:"
npm list -g synclaude --depth=0
echo ""

echo "10. Try manual linking if needed:"
if [ -d ~/.npm-global/lib/node_modules/synclaude ]; then
    echo "Found synclaude in node_modules, checking package.json bin..."
    if [ -f ~/.npm-global/lib/node_modules/synclaude/package.json ]; then
        echo "package.json bin field:"
        cat ~/.npm-global/lib/node_modules/synclaude/package.json | grep -A 5 '"bin"'
    fi

    echo "Creating bin directory if needed..."
    mkdir -p ~/.npm-global/bin

    echo "Attempting manual link..."
    if [ -f ~/.npm-global/lib/node_modules/synclaude/dist/cli/index.js ]; then
        echo "Found CLI entry point, creating symlink..."
        ln -sf ~/.npm-global/lib/node_modules/synclaude/dist/cli/index.js ~/.npm-global/bin/synclaude
        chmod +x ~/.npm-global/bin/synclaude
        echo "Manual link created"
    fi
fi
echo ""

echo "11. Final verification:"
echo "which synclaude: $(which synclaude)"
echo "ls -la ~/.npm-global/bin/synclaude: $(ls -la ~/.npm-global/bin/synclaude 2>/dev/null || echo 'File not found')"
echo ""

echo "12. Test the command:"
if command -v synclaude &> /dev/null; then
    echo "synclaude is available!"
    synclaude --version
else
    echo "synclaude command still not found"
fi