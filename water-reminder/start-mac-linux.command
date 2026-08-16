#!/usr/bin/env bash
# Double-click this file (macOS: Finder → double-click; Linux: mark executable → run).
# It installs dependencies the first time, then launches the Sip app.
set -e
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo ""
  echo "  Node.js isn't installed yet."
  echo "  Install it once from https://nodejs.org (the green 'LTS' button), then double-click this again."
  echo ""
  read -n 1 -s -r -p "Press any key to close..."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "First-time setup: installing Sip (this takes a minute)…"
  npm install
fi

echo "Launching Sip…"
npm start
