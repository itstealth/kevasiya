#!/bin/bash
# =============================================================================
# GENERATE SECURE SECRETS FOR PRODUCTION
# =============================================================================
# Run this script to generate secure random passwords
# Then copy these to your .env.production file
# =============================================================================

echo "============================================"
echo "  GENERATING SECURE SECRETS"
echo "============================================"
echo ""
echo "Copy these values to your .env.production file:"
echo ""

echo "# ========================"
echo "# Database Passwords"
echo "# ========================"
echo "MYSQL_ROOT_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9!@#$%^&*' | head -c 32)"
echo "DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9!@#$%^&*' | head -c 32)"
echo "STRAPI_DB_PASSWORD=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9!@#$%^&*' | head -c 32)"
echo ""

echo "# ========================"
echo "# JWT Secrets"
echo "# ========================"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "STRAPI_JWT_SECRET=$(openssl rand -base64 32)"
echo "STRAPI_ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo ""

echo "# ========================"
echo "# Strapi App Keys"
echo "# ========================"
STRAPI_KEYS=""
for i in 1 2 3 4; do
    if [ $i -gt 1 ]; then
        STRAPI_KEYS+=","
    fi
    STRAPI_KEYS+=$(openssl rand -base64 32)
done
echo "STRAPI_APP_KEYS=$STRAPI_API_KEYS"
echo "STRAPI_TOKEN_SALT=$(openssl rand -base64 32)"
echo "STRAPI_TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "STRAPI_ENCRYPTION_KEY=$(openssl rand -base64 32)"
echo ""

echo "# ========================"
echo "# Webhook Secret"
echo "# ========================"
echo "WEBHOOK_SECRET=$(openssl rand -base64 32)"
echo ""

echo "============================================"
echo "IMPORTANT: Store these securely!"
echo "Do not share these values publicly."
echo "============================================"
