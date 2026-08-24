#!/bin/bash
# File: /var/www/kevasiya.com/kevasiya.com/deploy_frontend.sh
set -euo pipefail

SITE_DIR="/var/www/kevasiya.com/kevasiya.com"
COMPOSE_FILE="docker-compose.production.yml"

cd "$SITE_DIR"

echo "Pulling latest code..."
git pull origin main

echo "Rebuilding frontend image..."
docker compose -f "$COMPOSE_FILE" build frontend

echo "Restarting frontend container..."
docker compose -f "$COMPOSE_FILE" up -d frontend

echo "Reloading nginx..."
docker compose -f "$COMPOSE_FILE" up -d nginx

echo "Deploy complete!"
docker compose -f "$COMPOSE_FILE" ps
