#!/bin/bash
# File: /var/www/kevasiya.com/kevasiya.com/deploy_backend.sh
set -euxo pipefail

SITE_DIR="/var/www/kevasiya.com/kevasiya.com"
COMPOSE_FILE="docker-compose.production.yml"

cd "$SITE_DIR"

echo "🚀 Pulling latest backend code..."
git pull origin main
echo "✅ Backend code pulled!"

echo "🔄 Rebuilding backend image..."
docker compose -f "$COMPOSE_FILE" build backend

echo "🔄 Restarting backend container..."
docker compose -f "$COMPOSE_FILE" up -d backend

echo "✅ Backend deploy complete!"
docker compose -f "$COMPOSE_FILE" ps backend
