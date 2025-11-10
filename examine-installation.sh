#!/bin/bash

echo "=== Examining Installation Structure ==="

echo "1. Check the symbolic link target:"
if [ -L ~/.npm-global/lib/node_modules/synclaude ]; then
    echo "Symlink target:"
    readlink ~/.npm-global/lib/node_modules/synclaude
    TARGET_DIR=$(readlink ~/.npm-global/lib/node_modules/synclaude)
    echo ""
    echo "2. Contents of target directory $TARGET_DIR:"
    ls -la "$TARGET_DIR"
    echo ""
    echo "3. Check if package.json exists in target:"
    if [ -f "$TARGET_DIR/package.json" ]; then
        echo "package.json found! Contents:"
        cat "$TARGET_DIR/package.json" | grep -A 10 '"bin"'
        echo ""
        echo "Full package.json structure:"
        cat "$TARGET_DIR/package.json"
    else
        echo "No package.json found in target directory"
    fi
    echo ""
    echo "4. Check if dist directory exists:"
    if [ -d "$TARGET_DIR/dist" ]; then
        echo "dist directory found!"
        echo "Contents of dist:"
        ls -la "$TARGET_DIR/dist"
        echo ""
        echo "Contents of dist/cli:"
        ls -la "$TARGET_DIR/dist/cli"
        echo ""
        echo "Check if CLI entry point exists:"
        if [ -f "$TARGET_DIR/dist/cli/index.js" ]; then
            echo "CLI entry point found!"
            echo "First few lines:"
            head -5 "$TARGET_DIR/dist/cli/index.js"
            echo ""
            echo "File permissions:"
            ls -la "$TARGET_DIR/dist/cli/index.js"
        fi
    else
        echo "No dist directory found"
        echo "Available directories in target:"
        ls -la "$TARGET_DIR" | grep "^d"
    fi
else
    echo "No symlink found at expected location"
fi

echo ""
echo "5. Check npm cache structure:"
echo "Contents of ~/.npm/_cacache/tmp/:"
ls -la ~/.npm/_cacache/tmp/ | head -10