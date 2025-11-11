#!/usr/bin/env node

const fs = require('fs');
const os = require('os');
const path = require('path');

const lifecycleEvent = process.env.npm_lifecycle_event || '';
const isGlobalInstall = process.env.npm_config_global === 'true';
const shouldRun = isGlobalInstall || lifecycleEvent === 'postlink';

if (!shouldRun || process.platform === 'win32') {
  process.exit(0);
}

const homeDir = os.homedir();
if (!homeDir) {
  process.exit(0);
}

const bashrcPath = path.join(homeDir, '.bashrc');
const localBinDir = path.join(homeDir, '.local', 'bin');
const blockStart = '# >>> synclaude path setup >>>';
const blockEnd = '# <<< synclaude path setup <<<';
const block = `${blockStart}
DEFAULT_PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
PATH_VALUE="\${PATH:-$DEFAULT_PATH}"
if [ -d "$HOME/.local/bin" ]; then
  case "$PATH_VALUE:" in
    "$HOME/.local/bin:"*)
      PATH="$PATH_VALUE"
      ;;
    *)
      path_wrapped=":$PATH_VALUE:"
      strip_pattern=":$HOME/.local/bin:"
      path_without_local="\${path_wrapped//$strip_pattern/:}"
      path_without_local="\${path_without_local#:}"
      path_without_local="\${path_without_local%:}"
      if [ -n "$path_without_local" ]; then
        PATH="$HOME/.local/bin:$path_without_local"
      else
        PATH="$HOME/.local/bin"
      fi
      ;;
  esac
else
  PATH="$PATH_VALUE"
fi
export PATH

if hash synclaude 2>/dev/null; then
  synclaude_path="$(hash -t synclaude 2>/dev/null)"
  if [ -n "$synclaude_path" ] && [ ! -x "$synclaude_path" ]; then
    hash -d synclaude 2>/dev/null
  fi
fi
${blockEnd}`;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const blockRegex = new RegExp(`${escapeRegExp(blockStart)}[\\s\\S]*?${escapeRegExp(blockEnd)}`, 'm');

const logPrefix = '[synclaude setup]';

try {
  fs.mkdirSync(localBinDir, { recursive: true });

  let bashrcContent = '';
  try {
    bashrcContent = fs.readFileSync(bashrcPath, 'utf8');
  } catch (readError) {
    if (readError.code !== 'ENOENT') {
      throw readError;
    }
  }

  let updatedContent;
  if (blockRegex.test(bashrcContent)) {
    updatedContent = bashrcContent.replace(blockRegex, block);
  } else if (bashrcContent.trim().length === 0) {
    updatedContent = `${block}\n`;
  } else {
    updatedContent = `${block}\n\n${bashrcContent}`;
  }

  if (updatedContent !== bashrcContent) {
    fs.writeFileSync(bashrcPath, updatedContent, 'utf8');
    console.log(`${logPrefix} Updated ~/.bashrc with Synclaude PATH guard.`);
  } else {
    console.log(`${logPrefix} ~/.bashrc already contains Synclaude PATH guard.`);
  }
} catch (error) {
  console.warn(`${logPrefix} Unable to update ~/.bashrc: ${error.message}`);
}
