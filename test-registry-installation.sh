#!/bin/bash

echo "=== Testing Installation from npm registry ==="

echo "1. Clear any existing installation:"
npm uninstall -g synclaude 2>/dev/null || true

echo ""
echo "2. Try installing from npm registry:"
npm install -g synclaude

echo ""
echo "3. Check installation:"
npm list -g synclaude

echo ""
echo "4. Check if command is available:"
which synclaude

echo ""
echo "5. Test the command:"
if command -v synclaude &> /dev/null; then
    echo "command found, testing:"
    synclaude --version
    echo ""
    synclaude --help
else
    echo "command not found"
fi

echo ""
echo "6. If npm registry fails, try direct clone and local install:"
if ! command -v synclaude &> /dev/null; then
    echo "npm registry failed, trying local installation..."

    cd /tmp
    rm -rf synclaude-local
    git clone https://github.com/jeffersonwarrior/synclaude.git synclaude-local
    cd synclaude-local

    echo "Installed dependencies and building..."
    npm install
    npm run build

    echo "Installing from local source..."
    npm install -g .

    echo "Testing again:"
    if command -v synclaude &> /dev/null; then
        synclaude --version
    else
        echo "Still failed. Manual debugging..."
        echo "Checking npm global structure:"
        ls -la ~/.npm-global/lib/node_modules/

        if [ -d ~/.npm-global/lib/node_modules/synclaude ]; then
            echo "Synclaude directory exists, checking contents:"
            ls -la ~/.npm-global/lib/node_modules/synclaude/

            echo "Checking dist/cli/index.js:"
            if [ -f ~/.npm-global/lib/node_modules/synclaude/dist/cli/index.js ]; then
                echo "CLI file exists, creating manual link..."
                mkdir -p ~/.npm-global/bin
                ln -sf ~/.npm-global/lib/node_modules/synclaude/dist/cli/index.js ~/.npm-global/bin/synclaude
                chmod +x ~/.npm-global/bin/synclaude

                if command -v synclaude &> /dev/null; then
                    echo "Manual link successful!"
                    synclaude --version
                fi
            fi
        fi
    fi
fi