#!/usr/bin/env bash
# royal-rumble — install / sync script
# ────────────────────────────────────────────────────────────────────
# Syncs the Desktop working copy to ~/.claude/skills/royal-rumble/
# so Claude Code loads the latest version on next restart.
#
# Lesson learned v0.9.0: we edited the Desktop folder for hours, pushed
# to GitHub, but Claude Code kept loading the stale installed copy.
# This script closes that gap.
#
# Usage:
#   ./scripts/install.sh          # sync + print version
#   ./scripts/install.sh --clean  # nuke installed + fresh sync
#
# After running: restart Claude Code to reload the skill.
# ────────────────────────────────────────────────────────────────────

set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
INSTALL_DIR="$HOME/.claude/skills/royal-rumble"
STALE_ZIP="$HOME/.claude/skills/royal-rumble.skill"

echo "📦 royal-rumble install/sync"
echo "   source: $REPO_DIR"
echo "   target: $INSTALL_DIR"
echo

# Remove stale .skill zip if present (causes duplicate registration)
if [ -f "$STALE_ZIP" ]; then
  echo "🗑️  Removing stale $STALE_ZIP (causes duplicate skill registration)"
  rm "$STALE_ZIP"
fi

# Clean install mode
if [ "${1:-}" = "--clean" ]; then
  echo "🧹 Clean install — removing existing installed copy"
  rm -rf "$INSTALL_DIR"
fi

# Fresh install if target doesn't exist
if [ ! -d "$INSTALL_DIR" ]; then
  echo "📂 Creating $INSTALL_DIR"
  mkdir -p "$INSTALL_DIR"
fi

# Sync essential files
echo "🔄 Syncing SKILL.md, skills/, data/, notes/"
cp "$REPO_DIR/SKILL.md" "$INSTALL_DIR/"
rm -rf "$INSTALL_DIR/skills" "$INSTALL_DIR/data" "$INSTALL_DIR/notes" 2>/dev/null || true
cp -R "$REPO_DIR/skills" "$INSTALL_DIR/"
[ -d "$REPO_DIR/data" ] && cp -R "$REPO_DIR/data" "$INSTALL_DIR/"
[ -d "$REPO_DIR/notes" ] && cp -R "$REPO_DIR/notes" "$INSTALL_DIR/"

# Report version
VERSION=$(grep -m1 "^version:" "$INSTALL_DIR/SKILL.md" | awk '{print $2}')
echo
echo "✅ Installed royal-rumble v$VERSION"
echo "   Restart Claude Code to reload."
