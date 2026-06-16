# Production Deployment Guide — The Visa Ghar

This manual describes how to deploy **The Visa Ghar** web application and admin portal on a Linux Ubuntu VPS (Virtual Private Server) using Nginx, PM2 (Process Manager), and a PostgreSQL database.

---

## 1. Server Provisioning & Prerequisites

We assume a clean installation of **Ubuntu 22.04 LTS** or **24.04 LTS**. Log in as `root` or a user with `sudo` privileges.

### Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Essential Utilities
```bash
sudo apt install -y curl git build-essential ufw certbot python3-certbot-nginx
```

---

## 2. Installing Runtime Dependencies

### Node.js (Version 20)
Install Node.js 20 using NodeSource:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Verify version (v20.x.x)
```

### PostgreSQL Database Server
Install and start PostgreSQL:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

Create a production database user and database schema:
```bash
sudo -i -u postgres psql
```
Inside the PostgreSQL terminal (`psql`):
```sql
CREATE DATABASE visaghar_prod;
CREATE USER visaghar_user WITH PASSWORD 'YOUR_STRONG_POSTGRES_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE visaghar_prod TO visaghar_user;
ALTER DATABASE visaghar_prod OWNER TO visaghar_user;
\q
```

### PM2 Process Manager
Install PM2 globally to manage node clustering and background processes:
```bash
sudo npm install -y -g pm2
```

---

## 3. Application Installation & Preparation

### Clone Code Repository
Clone code to `/var/www/thevisaghar`:
```bash
sudo mkdir -p /var/www/thevisaghar
sudo chown -R $USER:$USER /var/www/thevisaghar
git clone https://github.com/rajanchand/thevisaghar.git /var/www/thevisaghar
cd /var/www/thevisaghar
```

### Production Environment Settings
Create a production `.env` file:
```bash
cp .env.example .env
nano .env
```
Update the settings as follows:
```env
NODE_ENV="production"
PORT=3000

# Database Link
DATABASE_URL="postgresql://visaghar_user:YOUR_STRONG_POSTGRES_PASSWORD@localhost:5432/visaghar_prod?schema=public"

# NextAuth Configurations
NEXTAUTH_URL="https://thevisaghar.com"
# Generate secret: openssl rand -base64 32
NEXTAUTH_SECRET="YOUR_SECURE_NEXTAUTH_SECRET_KEY"

# Admin Initial Seed Credentials
ADMIN_SEED_PASSWORD="YOUR_COMPLEX_ADMIN_SEED_PASSWORD"

# API Integrations
ANTHROPIC_API_KEY="your-anthropic-claude-api-key"
RESEND_API_KEY="re-your-resend-api-key"

# Security Allowlist (Optional)
# ADMIN_IP_ALLOWLIST="1.2.3.4,5.6.7.8"
```

### Build Application Bundle
Install NPM packages, execute database migrations, seed initial users, and run Next.js compilation:
```bash
npm install --omit=dev
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
npm run build
```

---

## 4. PM2 Process Orchestration

To run the Next.js production build under PM2 with clustering support (utilizing multiple CPU cores) and auto-restart on crashes or reboots:

### Create PM2 Config
Create `ecosystem.config.js` in `/var/www/thevisaghar/`:
```javascript
module.exports = {
  apps: [
    {
      name: "thevisaghar",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      exec_mode: "cluster",
      instances: "max", // Scale to all available CPU cores
      env: {
        PORT: 3000,
        NODE_ENV: "production",
      },
      max_memory_restart: "1G",
      kill_timeout: 4000,
      wait_ready: true,
      listen_timeout: 5000,
    },
  ],
};
```

### Launch Process
```bash
pm2 start ecosystem.config.js
pm2 save
```

### Enable Auto-Restart on OS Reboot
Generate the systemd boot script:
```bash
pm2 startup
```
Copy and run the command printed in the terminal (e.g., `sudo env PATH=$PATH:/usr/bin ... pm2 startup systemd -u username --hp /home/username`).

### Setup Log Rotation
Install log rotator to prevent raw logs from filling up server disk space:
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## 5. Nginx Reverse Proxy & SSL (Let's Encrypt)

### Install Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Nginx Site Configuration
Create configuration file `/etc/nginx/sites-available/thevisaghar`:
```bash
sudo nano /etc/nginx/sites-available/thevisaghar
```
Paste the following server block:
```nginx
server {
    listen 80;
    server_name thevisaghar.com www.thevisaghar.com;
    
    # Static files routing optimization (Next.js assets cache bypass)
    location /_next/static {
        alias /var/www/thevisaghar/.next/static;
        access_log off;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /public/ {
        alias /var/www/thevisaghar/public/;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, must-revalidate";
    }

    # Uploads folder routing
    location /uploads/ {
        alias /var/www/thevisaghar/public/uploads/;
        client_max_body_size 5M;
        access_log off;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, must-revalidate";
    }

    # Reverse proxy Next.js node instances
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        
        # WebSockets support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        
        # Client IP header resolution
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Max request payload limits (5MB for media uploads compatibility)
        client_max_body_size 5M;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
    }
}
```

### Enable Site and Verify
Enable config, verify syntax, and reload Nginx:
```bash
sudo ln -sf /etc/nginx/sites-available/thevisaghar /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Enable SSL with Certbot Let's Encrypt
```bash
sudo certbot --nginx -d thevisaghar.com -d www.thevisaghar.com
```
Follow prompts to request certificates and enable automatic HTTP-to-HTTPS redirection. Certbot will automatically inject SSL parameters into Nginx.

---

## 6. Firewall Hardening (UFW)

Secure VPS ports using the Uncomplicated Firewall (UFW):
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full' # Port 80 & 443
sudo ufw enable
```

---

## 7. PostgreSQL Automated Backups Setup

Create a secure daily database backup routine.

### Create Backup Shell Script
Create a backups directory and script:
```bash
mkdir -p /var/www/thevisaghar/backups
nano /var/www/thevisaghar/backups/db-backup.sh
```
Paste the following script:
```bash
#!/bin/bash

# Configuration
DB_NAME="visaghar_prod"
DB_USER="visaghar_user"
BACKUP_DIR="/var/www/thevisaghar/backups"
RETENTION_DAYS=14
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/db_backup_${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "Starting database backup for $DB_NAME..."

# Export PGPASSWORD to bypass password prompt (Prisma .env user password)
export PGPASSWORD="YOUR_STRONG_POSTGRES_PASSWORD"

# Perform backup and compress
pg_dump -h localhost -U "$DB_USER" "$DB_NAME" | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "Backup successfully written to $BACKUP_FILE"
  
  # Remove old backups beyond retention days boundary
  find "$BACKUP_DIR" -name "db_backup_${DB_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
  echo "Old backups cleaned up."
else
  echo "ERROR: PostgreSQL database backup failed!" >&2
  exit 1
fi
```
Change script permissions:
```bash
chmod +x /var/www/thevisaghar/backups/db-backup.sh
```

### Schedule Cron Backup Job
Edit crontab for root or active user:
```bash
crontab -e
```
Add the following line to run backups automatically every day at 2:00 AM server time:
```cron
0 2 * * * /bin/bash /var/www/thevisaghar/backups/db-backup.sh >> /var/www/thevisaghar/backups/backup.log 2>&1
```

---

## 8. Rollout & Maintenance Scripts

### Fast Redeployment Script (`/var/www/thevisaghar/deploy.sh`)
Create a fast update script for code rollouts:
```bash
nano /var/www/thevisaghar/deploy.sh
```
Paste this script:
```bash
#!/bin/bash
set -e

echo "🚚 Pulling latest changes from Git..."
git pull

echo "📦 Installing production dependencies..."
npm install --omit=dev

echo "🗄️ Executing database migrations..."
npx prisma generate
npx prisma migrate deploy

echo "🏗️ Recompiling Next.js build bundle..."
npm run build

echo "🔄 Reloading PM2 processes with zero downtime..."
pm2 reload thevisaghar --update-env

echo "🚀 Deployment successfully completed!"
```
Make it executable:
```bash
chmod +x /var/www/thevisaghar/deploy.sh
```
To deploy new code, simply run:
```bash
./deploy.sh
```
