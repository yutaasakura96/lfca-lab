#!/usr/bin/env bash
# Block any push that would update `main`.
#
# `main` is production (docs/12-deployment.md §3): once Vercel is connected, a
# push to it deploys. Every other push — a feature branch, `develop` — is
# ordinary work and needs no ceremony.
#
# This is a hook rather than a permission rule because "push to main" cannot be
# written as a glob. `git push`, `git push origin HEAD`, `git push -u origin
# main` and `git push --all` all reach main by different spellings, and a prefix
# pattern cannot see which branch you are standing on. A script can.
#
# Blocking rather than prompting: a hook has no way to ask. Refusing, with the
# command to run, forces the decision back to the human — which is the point.
set -euo pipefail

repo="${CLAUDE_PROJECT_DIR:-.}"

# The hook receives the tool call as JSON on stdin.
payload="$(cat)"
command="$(printf '%s' "$payload" | /usr/bin/python3 -c \
  'import json,sys; print(json.load(sys.stdin).get("tool_input",{}).get("command",""))' 2>/dev/null || true)"

# Strip heredoc bodies before looking for a push.
#
# Found the hard way, on this hook's first real use: a command that writes
# documentation *about* pushing — `cat >> log.md <<'EOF' ... git push origin
# main ... EOF` — is not a push, but every substring test says it is. Prose
# travelling through a shell is still prose.
#
# This handles the common `<<'EOF' … EOF` shape. It cannot be exhaustive: a
# shell command is opaque, and no amount of matching reliably separates a
# documented command from an executed one. The real protection is not writing
# documents through Bash at all — use the file-editing tools, and then what
# reaches this hook is only ever a real command.
command="$(printf '%s' "$command" | awk '
  /<<-?'"'"'?[A-Za-z_]+'"'"'?/ && !inheredoc {
    match($0, /<<-?'"'"'?[A-Za-z_]+'"'"'?/)
    tag = substr($0, RSTART, RLENGTH)
    gsub(/^<<-?'"'"'?/, "", tag); gsub(/'"'"'$/, "", tag)
    inheredoc = 1; print; next
  }
  inheredoc && $0 == tag { inheredoc = 0; next }
  !inheredoc { print }
')"

# Not a push: nothing to guard.
case "$command" in
  *"git push"*) ;;
  *) exit 0 ;;
esac

branch="$(git -C "$repo" branch --show-current 2>/dev/null || true)"

targets_main=0
# An explicit target wins: `git push origin main`, `git push -u origin main`.
case "$command" in
  *" main"*|*" main:"*|*":main"*|*"--all"*|*"--mirror"*) targets_main=1 ;;
esac
# No explicit target while standing on main pushes main.
if [ "$branch" = "main" ] || [ "$branch" = "master" ]; then
  case "$command" in
    *" origin "*[a-z]*) ;;   # an explicit branch was named
    *) targets_main=1 ;;
  esac
fi

[ "$targets_main" -eq 1 ] || exit 0

cat >&2 <<MSG
Refusing to push to main without asking.

main is production (docs/12-deployment.md §3) — once Vercel is connected, this
push deploys. Every other push is allowed without a prompt; this one is not.

Ask the owner first. If they agree, they can run it themselves:

  git checkout main && git merge develop --ff-only && git push origin main

Currently on: ${branch:-detached HEAD}
MSG
exit 2
