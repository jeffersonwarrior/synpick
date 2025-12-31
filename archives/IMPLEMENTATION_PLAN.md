# Implementation Plan: Synclaude Installation and Updates Improvements

## Overview

This plan addresses critical issues with the Synclaude installation and Claude Code integration:

1. Synclaude does not properly install systemwide
2. It doesn't handle non-root installation (must install as sudo)
3. It doesn't update Claude Code automatically
4. Running synclaude should check for Claude Code updates and install it
5. The environment variable for Claude Code max token size needs to be set to 128000 automatically

---

## Issue Analysis

### Current State

| Issue | Current Behavior | Root Cause |
|-------|------------------|------------|
| Systemwide installation | Mixed manual/npm install with complex fallback logic | `install.sh` tries both methods, creates symlinks that may fail |
| Non-root installation | Falls back to manual install in `~/.local` | Manual install path when npm prefix is not user-writeable |
| Claude Code auto-update | None - manual only | Removed for simplicity, no update checking implemented |
| Claude Code update check on run | None | Not implemented |
| Max token size env var | Not set | Not included in `claude-launcher.ts` environment setup |

---

## Implementation Plan

### Phase 1: Fix Systemwide Installation (Non-Root)

**Goal**: Enable reliable systemwide installation without requiring sudo.

#### 1.1 Simplify `scripts/install.sh`

**Changes:**
- Remove complex fallback logic between npm global and manual install
- Use `npm install -g --unsafe-perm` when user prefix is not writeable
- Add explicit user-prefix detection and configuration
- Remove manual source building from main branch tarball

**Implementation Details:**

```bash
# New install.sh approach:
# 1. Check if npm user prefix is in home directory (non-sudo friendly)
# 2. If not, configure npm to use ~/.local as user prefix
# 3. Use npm registry install, not source building
# 4. Ensure PATH includes the npm bin directory
```

**File:** `scripts/install.sh`

**Key Changes:**
- Remove lines 118-182 (complex source build fallback)
- Replace with simpler npm registry install
- Add `npm config set prefix ~/.local` if needed for user install
- Use `npm install -g --unsafe-perm synclaude` for reliable installs

#### 1.2 Add `install.ts` Module

**New file:** `src/install/install.ts`

**Purpose:** TypeScript-based installation logic for better error handling and cross-platform support.

**Features:**
- Detect current npm configuration
- Configure user-level prefix if needed
- Handle PATH updates for all shells (bash, zsh, fish)
- Provide detailed error reporting

**Key methods:**
```typescript
installSythentic(options: InstallOptions): Promise<InstallResult>
detectInstallMethod(): InstallMethod
updatePathForInstall(): Promise<void>
verifyInstallation(): Promise<boolean>
```

---

### Phase 2: Claude Code Update Management

**Goal**: Automatic Claude Code updates checked when synclaude runs.

#### 2.1 Add Claude Code Version Manager

**New file:** `src/claude/manager.ts`

**Purpose:** Manage Claude Code installation and updates.

**Key classes:**

```typescript
export class ClaudeCodeManager {
  // Check if Claude Code is installed
  async checkInstallation(): Promise<boolean>

  // Get current Claude Code version
  async getCurrentVersion(): Promise<string | null>

  // Get latest Claude Code version from npm registry
  async getLatestVersion(): Promise<string | null>

  // Install or update Claude Code
  async installOrUpdate(force: boolean = false): Promise<UpdateResult>

  // Check if update is needed
  async needsUpdate(): Promise<boolean>

  // Get the Claude Code executable path
  async getClaudePath(): Promise<string>
}
```

**UpdateResult interface:**
```typescript
interface UpdateResult {
  success: boolean;
  action: 'none' | 'installed' | 'updated';
  previousVersion?: string;
  newVersion?: string;
  error?: string;
}
```

#### 2.2 Add Update Configuration

**Modify:** `src/config/types.ts`

**Add to AppConfigSchema:**
```typescript
{
  autoUpdateClaudeCode: z.boolean().default(true),
  claudeCodeUpdateCheckInterval: z.number().default(24), // hours
  lastClaudeCodeUpdateCheck: z.string().optional(),
  maxTokenSize: z.number().default(128000),
}
```

#### 2.3 Add Update CLI Command

**Modify:** `src/cli/commands.ts`

**Add new command:**
```typescript
// Update Claude Code command
program
  .command('update')
  .description('Update Claude Code to the latest version')
  .option('-f, --force', 'Force update even if already up to date')
  .action(async (options) => {
    await app.updateClaudeCode(options.force);
  });

// Check for updates only
program
  .command('check-update')
  .description('Check if there are updates available')
  .action(async () => {
    await app.checkForUpdates();
  });
```

#### 2.4 Add Update Logic to App

**Modify:** `src/core/app.ts`

**Add methods:**
```typescript
// Check and update Claude Code on startup
async ensureClaudeCodeUpdated(force: boolean = false): Promise<void>

// Update Claude Code (explicit command)
async updateClaudeCode(force: boolean = false): Promise<void>

// Check for updates (doesn't install)
async checkForUpdates(): Promise<void>
```

**Integration:** Call `ensureClaudeCodeUpdated()` before launching Claude Code in the main entry point.

---

### Phase 3: Max Token Size Environment Variable

**Goal**: Set `CLAUDE_CODE_MAX_TOKEN_SIZE` to 128000 automatically.

#### 3.1 Modify Claude Launcher

**Modify:** `src/launcher/claude-launcher.ts`

**Add to LaunchOptions interface:**
```typescript
export interface LaunchOptions {
  model: string;
  claudePath?: string;
  additionalArgs?: string[];
  env?: Record<string, string>;
  thinkingModel?: string | null;
  maxTokenSize?: number;  // NEW
}
```

**Add to createClaudeEnvironment method:**
```typescript
private createClaudeEnvironment(options: LaunchOptions): Record<string, string> {
  const env: Record<string, string> = {};
  const model = options.model;

  // ... existing ANTHROPIC_BASE_URL and model vars ...

  // Set max token size (default 128000 if not specified)
  env.CLAUDE_CODE_MAX_TOKEN_SIZE = (options.maxTokenSize ?? 128000).toString();

  // Set thinking model if provided
  if (options.thinkingModel) {
    env.ANTHROPIC_THINKING_MODEL = options.thinkingModel;
  }

  // Disable non-essential traffic
  env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = '1';

  return env;
}
```

#### 3.2 Pass Max Token Size from Config

**Modify:** `src/core/app.ts`

**Add maxTokenSize to launch options:**
```typescript
const launchOptions: LaunchOptions = {
  model,
  additionalArgs: args.dangerously ? ['--dangerously-skip-permissions'] : [],
  env: {
    ANTHROPIC_AUTH_TOKEN: this.configManager.getApiKey(),
  },
  maxTokenSize: this.configManager.getConfig().maxTokenSize ?? 128000,
};
```

---

### Phase 4: Integration and Testing

#### 4.1 Update Main Entry Point

**Modify:** `src/index.ts`

**Add startup update checking:**
```typescript
// Before launching, check for Claude Code updates
if (config.autoUpdateClaudeCode) {
  await app.ensureClaudeCodeUpdated();
}
```

#### 4.2 Update Doctor Command

**Modify:** `src/core/app.ts` (doctor method)

**Add checks for:**
- Claude Code installation
- Claude Code version status
- Update available status
- Max token size configuration

#### 4.3 Add Tests

**New/Modified test files:**
- `src/install/install.test.ts` - Test installation logic
- `src/claude/manager.test.ts` - Test Claude Code update manager
- `src/launcher/claude-launcher.test.ts` - Test max token size env var

---

## File Summary

### New Files
- `src/install/install.ts` - Installation logic module
- `src/claude/manager.ts` - Claude Code version management

### Modified Files
- `scripts/install.sh` - Simplified, npm-based install
- `src/cli/commands.ts` - Add `update` and `check-update` commands
- `src/config/types.ts` - Add update config options
- `src/core/app.ts` - Add update methods and integration
- `src/launcher/claude-launcher.ts` - Add maxTokenSize support
- `src/index.ts` - Add startup update checking

### New Test Files
- `src/install/install.test.ts`
- `src/claude/manager.test.ts`

---

## Implementation Order

1. **Phase 1** - Fix installation (prerequisite for everything else)
2. **Phase 3** - Max token size (simplest, independent)
3. **Phase 2** - Claude Code updates (depends on installation working)
4. **Phase 4** - Integration and testing (ties everything together)

---

## Success Criteria

- [ ] Install script works without sudo on Unix systems
- [ ] Configured npm prefix properly for user-level installs
- [ ] Claude Code is checked for updates on startup
- [ ] User can manually trigger updates with `synclaude update`
- [ ] `CLAUDE_CODE_MAX_TOKEN_SIZE` is set to 128000 by default
- [ ] Max token size can be configured via config file
- [ ] All changes pass existing tests
- [ ] New tests provide adequate coverage
- [ ] `synclaude doctor` reports update status
