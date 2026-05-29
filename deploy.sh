#!/bin/bash
set -e

# =============================================================================
# KEVASIYA SECURE DEPLOYMENT SCRIPT
# =============================================================================
# This script deploys kevasiya.com with security best practices
# =============================================================================

echo "============================================"
echo "  KEVASIYA SECURE DEPLOYMENT"
echo "============================================"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
   echo "Error: Do not run as root. Use a regular user with sudo."
   exit 1
fi

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# =============================================================================
# STEP 1: PREREQUISITES CHECK
# =============================================================================
log_info "Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Install Docker first."
    exit 1
fi

# Check Docker Compose
if ! command -v docker compose &> /dev/null; then
    log_error "Docker Compose not found."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env.production ]; then
    log_warn ".env.production not found!"
    log_info "Copy .env.production.template to .env.production and fill in values"
    log_info "Then run this script again."
    exit 1
fi

# =============================================================================
# STEP 2: GENERATE SECRETS (if not set)
# =============================================================================
log_info "Checking environment variables..."

# Source the env file
set -a
source .env.production
set +a

# Check for placeholder values
if grep -q "<GENERATE_" .env.production 2>/dev/null; then
    log_error "Please update .env.production with real secrets!"
    log_info "Run: openssl rand -base64 32 for each secret"
    exit 1
fi

# =============================================================================
# STEP 3: CREATE DIRECTORIES
# =============================================================================
log_info "Creating required directories..."

mkdir -p nginx/ssl
mkdir -p nginx/conf.d
mkdir -p backend/uploads
mkdir -p mysql/conf.d
mkdir -p strapi_nginx/ssl
mkdir -p strapi_nginx/conf.d
mkdir -p strapi_mysql/conf.d
mkdir -p backups

# =============================================================================
# STEP 4: GENERATE SSL CERTIFICATES (Let's Encrypt)
# =============================================================================
log_info "Setting up SSL certificates..."

if [ ! -f "nginx/ssl/fullchain.pem" ]; then
    log_warn "SSL certificates not found."
    log_info "Run after deployment: sudo certbot --nginx -d kevasiya.com"
    # Create self-signed for testing
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/ssl/privkey.pem \
        -out nginx/ssl/fullchain.pem \
        -subj "/C=US/ST=State/L=City/O=Kevasiya/CN=kevasiya.com" 2>/dev/null
    log_warn "Using self-signed SSL (replace with Let's Encrypt for production)"
fi

# =============================================================================
# STEP 5: BUILD DOCKER IMAGES
# =============================================================================
log_info "Building Docker images (this may take a while)..."

docker compose -f docker-compose.production.yml build --no-cache

# =============================================================================
# STEP 6: START SERVICES
# =============================================================================
log_info "Starting services..."

docker compose -f docker-compose.production.yml up -d

# Wait for database to be ready
log_info "Waiting for database to be ready..."
sleep 10

# =============================================================================
# STEP 7: VERIFY SERVICES
# =============================================================================
log_info "Verifying services..."

# Check all containers
docker compose -f docker-compose.production.yml ps

# Check health
sleep 5

# Test frontend
if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    log_info "Frontend: OK"
else
    log_warn "Frontend: Not responding yet"
fi

# Test backend
if curl -sf http://localhost:5001/api/health > /dev/null 2>&1; then
    log_info "Backend: OK"
else
    log_warn "Backend: Not responding yet"
fi

# =============================================================================
# STEP 8: SETUP BACKUP CRON
# =============================================================================
log_info "Setting up automated backups..."

# Create backup script
cat > backups/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

mkdir -p $BACKUP_DIR

# Backup database
docker exec kevasiya_db mysqldump -u root -p$MYSQL_ROOT_PASSWORD kevasiya_db > $BACKUP_DIR/kevasiya_db_$DATE.sql

# Keep only last 7 backups
find $BACKUP_DIR -name "kevasiya_db_*.sql" -mtime +7 -delete

echo "Backup completed: kevasiya_db_$DATE.sql"
EOF

chmod +x backups/backup.sh

# Add to crontab (daily at 2am)
(crontab -l 2>/dev/null | grep -v "backups/backup.sh"; echo "0 2 * * * /path/to/backups/backup.sh") | crontab -

# =============================================================================
# STEP 9: SECURITY HARDENING
# =============================================================================
log_info "Applying additional security measures..."

# Enable UFW (uncomment after initial setup)
# ufw --force enable
# ufw default deny incoming
# ufw default allow outgoing
# ufw allow 80/tcp
# ufw allow 443/tcp
# ufw allow <SSH_PORT>/tcp

# Install Fail2Ban
if ! command -v fail2ban-client &> /dev/null; then
    log_warn "Fail2Ban not installed. Run: sudo apt install fail2ban"
fi

# =============================================================================
# FINAL MESSAGE
# =============================================================================
echo ""
echo "============================================"
echo "  DEPLOYMENT COMPLETE!"
echo "============================================"
echo ""
echo "Services running:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend:  http://localhost:5001"
echo "  - Nginx:    http://localhost:80"
echo ""
echo "Next steps:"
echo "  1. Configure SSL with Let's Encrypt:"
echo "     sudo certbot --nginx -d kevasiya.com"
echo ""
echo "  2. Update firewall:"
echo "     sudo ufw allow 80,443"
echo "     sudo ufw allow <YOUR_SSH_PORT>"
echo "     sudo ufw enable"
echo ""
echo "  3. Rotate all secrets before production!"
echo ""
echo "To view logs: docker compose logs -f"
echo "To stop: docker compose down"
echo ""
