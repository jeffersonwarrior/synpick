#!/bin/bash

echo "=== Comprehensive Installation Debug ==="

echo "1. Reinstall with verbose output and examine the actual process:"
echo "Clearing any existing installation..."
npm uninstall -g synclaude 2>/dev/null || true

echo ""
echo "Installing fresh..."
npm install -g https://github.com/jeffersonwarrior/synclaude.git --verbose

echo ""
echo "2. Check npm's view of the installation:"
npm list -g --depth=0

echo ""
echo "3. Check what's actually in the npm global directories:"
echo "Global lib directory:"
ls -la ~/.npm-global/lib/
echo ""
echo "Global node_modules:"
ls -la ~/.npm-global/lib/node_modules/

if [ -L ~/.npm-global/lib/node_modules/synclaude ]; then
    echo ""
    echo "Found synclaude symlink, checking target:"
    TARGET=$(readlink ~/.npm-global/lib/node_modules/synclaude)
    echo "Target: $TARGET"
    echo ""
    if [ -d "$TARGET" ]; then
        echo "Target directory exists, contents:"
        ls -la "$TARGET"
        echo ""
        echo "Checking for package.json:"
        if [ -f "$TARGET/package.json" ]; then
            echo "package.json found!"
            echo "Bin configuration:"
            cat "$TARGET/package.json" | grep -A 5 '"bin"'
            echo ""
            echo "Files field:"
            cat "$TARGET/package.json" | grep -A 10 '"files"'
        else
            echo "No package.json in target"
        fi
        echo ""
        echo "Checking source directory:"
        if [ -d "$TARGET/src" ]; then
            echo "src directory found"
        else
            echo "No src directory"
        fi
        echo ""
        echo "Checking dist directory:"
        if [ -d "$TARGET/dist" ]; then
            echo "dist directory found"
            ls -la "$TARGET/dist"
            if [ -d "$TARGET/dist/cli" ]; then
                echo "dist/cli found"
                ls -la "$TARGET/dist/cli"
                if [ -f "$TARGET/dist/cli/index.js" ]; then
                    echo "CLI entry point exists"
                    echo "File permissions: $(ls -la $TARGET/dist/cli/index.js)"
                    echo "First line: $(head -1 $TARGET/dist/cli/index.js)"
                fi
            fi
        else
            echo "No dist directory found"
            echo "Available directories:"
            ls -la "$TARGET" | grep "^d"
        fi
    else
        echo "Target directory does not exist!"
    fi
else
    echo "No synclaude symlink found"
fi

echo ""
echo "4. Check for bin directory and manual linking:"
BIN_DIR="$HOME/.npm-global/bin"
echo "Bin directory: $BIN_DIR"
if [ -d "$BIN_DIR" ]; then
    echo "Bin directory exists, contents:"
    ls -la "$BIN_DIR"
else
    echo "Bin directory does not exist, creating it..."
    mkdir -p "$BIN_DIR"
fi

echo ""
echo "5. Manual linking attempt:"
if [ -L ~/.npm-global/lib/node_modules/synclaude ]; then
    TARGET=$(readlink ~/.npm-global/lib/node_modules/synclaude)
    CLI_PATH="$TARGET/dist/cli/index.js"
    if [ -f "$CLI_PATH" ]; then
        echo "Creating manual symlink to $CLI_PATH"
        ln -sf "$CLI_PATH" "$BIN_DIR/synclaude"
        chmod +x "$BIN_DIR/synclaude"
        echo "Symlink created"
        echo "File exists: $(test -f $BIN_DIR/synclaude && echo 'YES' || echo 'NO')"
        echo "File executable: $(test -x $BIN_DIR/synclaude && echo 'YES' || echo 'NO')"
        echo "which synclaude: $(which synclaude)"

        if command -v synclaude &> /dev/null; then
            echo ""
            echo "Testing the command:"
            synclaude --version
            echo ""
            echo "SUCCESS! CLI command is working"
        else
            echo "Command still not found"
        fi
    else
        echo "CLI file not found at $CLI_PATH"
    fi
fi

echo ""
echo "6. Final environment check:"
echo "PATH: $PATH"
echo "npm prefix: $(npm config get prefix)"