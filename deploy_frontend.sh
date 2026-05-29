# File: /var/www/running_sites/kevasiya.com/deploy_frontend.sh
#!/bin/bash

# Go to frontend project
cd /var/www/running_sites/kevasiya.com/frontend

echo "Pulling latest code..."
git pull

echo "Installing dependencies..."
pnpm install

echo "Building project..."
pnpm run build

echo "Restarting PM2 frontend process..."
pm2 restart kevasiya_frontend

echo "Restarting PM2 backend process..."
pm2 restart kevasiya-backend

echo "Restarting Apache..."
sudo systemctl restart apache2

echo "Deploy complete!"
