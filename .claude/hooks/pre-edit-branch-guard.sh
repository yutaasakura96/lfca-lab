#!/usr/bin/env bash
# Block edits on protected branches.
# Push to main deploys production (docs/12-deployment.md §3), so main is never
# edited directly — branch, then open a PR and let the preview prove it.
set -euo pipefail

PROTECTED="main master"
branch="$(git -C "${CLAUDE_PROJECT_DIR:-.}" branch --show-current 2>/dev/null || true)"

# Detached HEAD or not a git repo: nothing to protect.
[ -n "$branch" ] || exit 0

for p in $PROTECTED; do
  if [ "$branch" = "$p" ]; then
    cat >&2 <<MSG
Refusing to edit on '$branch'. Pushing this branch deploys production.

  git switch -c <type>/<short-description>

Then edit, open a PR, and let the Vercel preview and CI prove it first.
MSG
    exit 2
  fi
done

exit 0
