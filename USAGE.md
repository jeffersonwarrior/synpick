# Synclaude Usage Guide

Complete reference for using Synclaude with Claude Code and Synthetic AI models.

## Table of Contents

- [Quick Start](#quick-start)
- [Model Selection](#model-selection)
- [Model Management](#model-management)
- [Configuration](#configuration)
- [System Tools](#system-tools)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### First-Time Setup

After installation, run the setup wizard:

```bash
synclaude setup
```

The setup wizard will guide you through:
1. Configuring your Synthetic API key
2. Testing your API connection
3. Selecting your first model

### Launch Claude Code

```bash
# Interactive model selection (uses saved model if available)
synclaude

# Or explicitly:
synclaude launch
```

---

## Model Selection

### Interactive Selection

```bash
synclaude model
```

This opens a rich terminal UI to browse and select models:
- Use **↑/↓** to navigate
- **Search** by typing provider or model name (e.g., "gpt", "claude", "openai")
- **Enter** to select
- **Esc** to cancel

### Specific Model Selection

```bash
# Launch with a specific model
synclaude --model "openai:gpt-4"

# Or:
synclaude -m "claude:claude-3-5-sonnet-20241022"

# Use the saved/default model
synclaude
```

### Model Categories

Models are organized by provider:

| Provider | Examples | Use Case |
|----------|----------|----------|
| OpenAI | `gpt-4`, `gpt-4o`, `gpt-3.5-turbo` | General-purpose, coding |
| Anthropic | `claude-3-5-sonnet`, `claude-3-opus` | Long context, nuanced tasks |
| Others | Various | Experimental, specialized |

---

## Model Management

### List All Models

```bash
# List all available models
synclaude models

# Display with details (provider, context size, etc.)
synclaude models --verbose
```

### Search Models

```bash
# Search by name or keyword
synclaude search "gpt"

# Search for specific provider
synclaude search "openai"

# Search partial names
synclaude search "sonnet"
```

### Refresh Cache

```bash
# Force refresh model list from API
synclaude models --refresh

# Or use the cache command
synclaude cache refresh
```

---

## Configuration

### Show Configuration

```bash
# Show current configuration
synclaude config show

# Filter to specific setting
synclaude config show apiKey
```

### Set Configuration

```bash
# Set API key
synclaude config set apiKey "your-api-key-here"

# Set cache duration (2-168 hours, default 24)
synclaude config set cacheDurationHours 12

# Set default model (uses model ID from "synclaude models")
synclaude config set selectedModel "openai:gpt-4"
```

### Reset Configuration

```bash
# Reset to defaults
synclaude config reset

# Reset specific option
synclaude config reset apiKey
```

### Configuration File Location

Configuration is stored in: `~/.config/synclaude/config.json`

```json
{
  "apiKey": "your-api-key",
  "baseUrl": "https://api.synthetic.new",
  "modelsApiUrl": "https://api.synthetic.new/openai/v1/models",
  "cacheDurationHours": 24,
  "selectedModel": "openai:gpt-4",
  "firstRunCompleted": true
}
```

---

## System Tools

### Doctor (Diagnostics)

```bash
# Run full diagnostic check
synclaude doctor
```

The doctor command checks:
- Node.js and npm versions
- Installation status
- Configuration validity
- API connectivity
- Cache status
- PATH configuration

### Version Information

```bash
# Show installed version
synclaude --version

# Short form
synclaude -V
```

### Update

```bash
# Update to latest version from GitHub
synclaude update
```

The update command:
- Checks GitHub for latest release
- Compares using semver (no downgrades)
- Runs installer if update available
- Only updates from official releases

### Cache Management

```bash
# Clear model cache
synclaude cache clear

# Refresh cache from API
synclaude cache refresh

# Show cache info (size, age, etc.)
synclaude cache info
```

Cache is stored in: `~/.config/synclaude/models_cache.json`

---

## Advanced Usage

### Environment Variables

Override configuration with environment variables:

```bash
# Set API key (overrides config)
export SYNTHETIC_API_KEY="your-api-key"

# Custom API base URL
export SYNTHETIC_BASE_URL="https://api.synthetic.new"

# Cache duration (overrides config)
export SYNTHETIC_CACHE_DURATION=12

# Then run synclaude
synclaude
```

### Silent Mode

```bash
# Launch Claude Code without banner
synclaude --quiet

# Or:
synclaude -q
```

### Verbose Logging

```bash
# Enable verbose debug output
synclaude --verbose

# Or:
synclaude -v
```

### Configuration File Format

The configuration file is validated using Zod schemas:

```json
{
  "apiKey": string,              // Required: Your API key
  "baseUrl": string,             // Optional: API base URL (default: https://api.synthetic.new)
  "modelsApiUrl": string,        // Optional: Models endpoint (default: baseUrl + /openai/v1/models)
  "cacheDurationHours": 2-168,   // Optional: Cache duration (default: 24)
  "selectedModel": string,       // Optional: Default model ID
  "firstRunCompleted": boolean   // Internal: Setup wizard complete flag
}
```

---

## Examples

### Common Workflows

#### 1. Fresh Installation

```bash
# Install
git clone https://github.com/jeffersonwarrior/synclaude.git
cd synclaude
./scripts/install.sh

# Setup
synclaude setup

# Launch
synclaude
```

#### 2. Quick Model Switch

```bash
# List available models
synclaude models

# Search for a specific one
synclaude search "gpt-4"

# Launch with it directly
synclaude --model "openai:gpt-4"
```

#### 3. Save a Favorite Model

```bash
# Select and save
synclaude model

# Now launches use saved model
synclaude

# Check what's saved
synclaude config show selectedModel
```

#### 4. Debug Connection Issues

```bash
# Run diagnostics
synclaude doctor

# Refresh cache
synclaude cache refresh

# Test with verbose output
synclaude --verbose models
```

#### 5. Update to Latest

```bash
# Check version
synclaude --version

# Update
synclaude update

# Verify
synclaude --version
```

---

## Troubleshooting

### "Command not found" Error

```bash
# Check installation
npm list -g synclaude

# Find where npm installed binaries
npm bin -g

# Add to PATH if needed
export PATH="$PATH:$(npm bin -g)"
```

### API Key Issues

```bash
# Reset API key
synclaude config set apiKey "your-new-key"

# Or use env var
export SYNTHETIC_API_KEY="your-new-key"
synclaude

# Verify with doctor
synclaude doctor
```

### stale Models

```bash
# Force refresh
synclaude cache clear
synclaude models --refresh
```

### Permission Errors

```bash
# On Linux/macOS, fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
./scripts/install.sh
```

### Get Help

```bash
# General help
synclaude --help

# Command-specific help
synclaude models --help
synclaude config --help
synclaude cache --help

# Diagnostic info
synclaude doctor
```

---

## Additional Resources

- **Installation**: See [README.md](README.md) for installation instructions
- **Development**: See [CLAUDE.md](CLAUDE.md) for development guide
- **Issues**: [GitHub Issues](https://github.com/jeffersonwarrior/synclaude/issues)
- **Source**: [GitHub Repository](https://github.com/jeffersonwarrior/synclaude)
