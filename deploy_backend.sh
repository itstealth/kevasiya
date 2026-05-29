#!/bin/bash

# OPTIONAL: Show each command as it runs
set -x

echo "🚀 Pulling latest backend code..."
cd /var/www/running_sites/kevasiya.com/backend

# Make sure your Git remote is correct and you have SSH keys if needed
git pull origin main
echo "✅ Backend code pulled!"

echo "🔄 Installing backend dependencies..."
pnpm install
echo "✅ Backend dependencies installed!"

echo "🔄 Restarting backend..."

# Use full path to pm2 if necessary
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v18/bin

# Confirm the PM2 process name exactly matches what 'pm2 list' shows
pm2 restart kevasiya-backend

echo "✅ Backend deploy complete!"
