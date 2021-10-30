#!/usr/bin/env node

set -e

concurrently --kill-others --names "server,client-web" --prefix name \
  "cd packages/server && npm start" \
  "cd packages/client-web && npm start"
