#!/bin/bash
# Dev deploy: bump version, rebuild, deploy to HA
# Called by PostToolUse hook on Edit/Write to src/ files

set -e

FILE_PATH=$(jq -r '.tool_input.file_path // .tool_response.filePath // ""' 2>/dev/null)

# Only trigger for src/ files
if [[ ! "$FILE_PATH" =~ /shabbat-card/src/ ]]; then
  exit 0
fi

cd /home/claude-svc/shabbat-card

# Bump the dev build number in VERSION
CURRENT=$(grep -oP "VERSION = '[^']+'" src/constants.js | grep -oP "'\K[^']+")
BASE=$(echo "$CURRENT" | sed 's/-dev\.[0-9]*//' | sed 's/-dev//')
# Extract current build number, default to 0
BUILD=$(echo "$CURRENT" | grep -oP 'dev\.\K[0-9]+' || echo "0")
NEXT=$((BUILD + 1))
NEW_VERSION="${BASE}-dev.${NEXT}"

sed -i "s/VERSION = '${CURRENT}'/VERSION = '${NEW_VERSION}'/" src/constants.js

# Rebuild
npx rollup -c --silent 2>/dev/null

# Gzip + deploy
gzip -k -f dist/shabbat-card.js
smbclient //192.168.4.84/config -A ~/.smbcredentials -c "cd www/community/shabbat-card; put dist/shabbat-card.js.gz shabbat-card.js.gz; put dist/shabbat-card.js shabbat-card.js" 2>/dev/null

echo "{\"hookSpecificOutput\":{\"hookEventName\":\"PostToolUse\",\"additionalContext\":\"Auto-deployed v${NEW_VERSION} to HA\"}}"
