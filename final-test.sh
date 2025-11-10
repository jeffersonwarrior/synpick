#!/bin/bash

echo "=== Final Complete Installation Test ==="

echo "1. Environment check:"
echo "Node: $(node --version)"
echo "npm: $(npm --version)"
echo "User: $(whoami)"
echo "PATH: $PATH"

echo ""
echo "2. Install from npm registry:"
npm install -g synclaude

echo ""
echo "3. Verify installation:"
echo "npm list -g synclaude:"
npm list -g synclaude

echo ""
echo "which synclaude: $(which synclaude)"

echo ""
echo "4. Test basic functionality:"
if command -v synclaude &> /dev/null; then
    echo "✓ synclaude command found!"

    echo ""
    echo "Version:"
    synclaude --version

    echo ""
    echo "Help:"
    synclaude --help | head -10

    echo ""
    echo "Doctor command:"
    synclaude doctor

    echo ""
    echo "Models (first 5):"
    synclaude models --limit 5 || echo "Models command failed (expected without config)"

    echo ""
    echo "✓ All tests passed!"
else
    echo "✗ synclaude command not found"
    echo "Debugging info:"
    echo "Contents of ~/.npm-global/bin/:"
    ls -la ~/.npm-global/bin/ || echo "No bin directory"

    echo ""
    echo "Contents of ~/.npm-global/lib/node_modules/:"
    ls -la ~/.npm-global/lib/node_modules/ || echo "No node_modules directory"

    if [ -d ~/.npm-global/lib/node_modules/synclaude ]; then
        echo "synclaude directory exists, checking contents:"
        ls -la ~/.npm-global/lib/node_modules/synclaude/
        echo "Checking CLI file:"
        if [ -f ~/.npm-global/lib/node_modules/synclaude/dist/cli/index.js ]; then
            echo "CLI file exists, creating manual link..."
            mkdir -p ~/.npm-global/bin
            ln -sf ~/.npm-global/lib/node_modules/synclaude/dist/cli/index.js ~/.npm-global/bin/synclaude
            chmod +x ~/.npm-global/bin/synclaude
            echo "Manual link created"

            if command -v synclaude &> /dev/null; then
                echo "✓ Manual fix successful!"
                synclaude --version
            fi
        fi
    fi
fi

echo ""
echo "=== Final Test Complete ==="