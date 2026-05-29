# KEVASIYA DEPLOYMENT CHECKLIST

## Pre-Deployment Security (On Server)

### Step 1: OS Setup
```bash
# 1. Reinstall OS from official ISO (OVH/Provider)
# 2. Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 3. Disable unused services
sudo systemctl stop rpcbind avahi-daemon 2>/dev/null || true
sudo systemctl disable rpcbind avahi-daemon 2>/dev/null || true
```

### Step 2: SSH Hardening
```bash
# 1. Generate SSH key on local machine
ssh-keygen -t ed25519 -C "deploy@kevasiya"

# 2. Copy key to server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@server

# 3. Edit SSH config
sudo nano /etc/ssh/sshd_config

# Add/modify:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
MaxAuthTries 3
ClientAliveInterval 300

# 4. Restart SSH
sudo systemctl restart sshd
```

### Step 3: Firewall
```bash
# 1. Install UFW
sudo apt install ufw

# 2. Configure
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow <YOUR_SSH_PORT>/tcp

# 3. Enable
sudo ufw enable
```

### Step 4: Fail2Ban
```bash
sudo apt install fail2ban

# Configure
sudo nano /etc/fail2ban/jail.local

[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = <YOUR_SSH_PORT>

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### Step 5: Docker Installation
```bash
# 1. Install Docker from official repo
curl -fsSL https://get.docker.com | sh

# 2. Add user to docker group
sudo usermod -aG docker $USER

# 3. Configure Docker daemon
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "userns-remap": "default",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2"
}
EOF

# 4. Enable Docker
sudo systemctl enable docker
sudo systemctl start docker
```

---

## Deployment (From Local Machine)

### Step 1: Prepare Server
```bash
# 1. Create deployment directory
ssh user@server "mkdir -p /var/www/kevasiya"

# 2. Copy files
rsync -avz --exclude='node_modules' --exclude='.git' ./ user@server:/var/www/kevasiya/
```

### Step 2: Configure Environment
```bash
# 1. Copy template
scp .env.production.template user@server:/var/www/kevasiya/.env.production

# 2. Edit with real secrets
ssh user@server "nano /var/www/kevasiya/.env.production"
```

### Step 3: Deploy
```bash
# Run deployment script
ssh user@server "cd /var/www/kevasiya && chmod +x deploy.sh && ./deploy.sh"
```

---

## Security Checklist (Post-Deployment)

| # | Item | Command | Status |
|---|------|---------|--------|
| 1 | Change all passwords | Use openssl rand | ⬜ |
| 2 | Setup SSL (Let's Encrypt) | certbot --nginx -d kevasiya.com | ⬜ |
| 3 | Test backup restoration | ./backups/backup.sh | ⬜ |
| 4 | Monitor logs | docker compose logs -f | ⬜ |
| 5 | Setup monitoring | Prometheus + Grafana | ⬜ |
| 6 | Enable firewall | ufw enable | ⬜ |

---

## Quick Commands

```bash
# View logs
docker compose -f docker-compose.production.yml logs -f

# Restart services
docker compose -f docker-compose.production.yml restart

# Update & rebuild
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d --build

# View resource usage
docker stats

# View all containers
docker ps -a
```
