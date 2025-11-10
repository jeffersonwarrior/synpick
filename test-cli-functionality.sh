#!/bin/bash

echo "=== Testing CLI Functionality ==="

echo "1. Check synclaude version:"
synclaude --version

echo ""
echo "2. Test doctor command:"
synclaude doctor

echo ""
echo "3. Test models command:"
synclaude models --limit 5

echo ""
echo "4. Test config command:"
synclaude config --help

echo ""
echo "5. Test help for search:"
synclaude search --help

echo ""
echo "6. Check configuration directory:"
if [ -d ~/.config/synclaude ]; then
    echo "Config directory exists:"
    ls -la ~/.config/synclaude/
else
    echo "No config directory found"
fi

echo ""
echo "7. Check PATH configuration:"
echo "which synclaude: $(which synclaude)"
echo "symlink target: $(readlink $(which synclaude))"
echo "file permissions: $(ls -la $(which synclaude))"

echo ""
echo "8. Test with minimal input (non-interactive):"
echo "Testing with --help flag:"
synclaude setup --help

echo ""
echo "=== CLI Functionality Test Complete ==="