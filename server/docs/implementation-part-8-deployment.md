# Part 8: Deployment & DevOps

> Rice Mill SaaS Platform - Production Deployment Guide

---

## 1. Environment Variables

### .env.example

```env
# Server Configuration
NODE_ENV=production
PORT=5000
API_VERSION=v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ricemill

# JWT Secrets (MUST BE DIFFERENT AND STRONG)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-min-32-characters-change-this
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-different-secret-refresh-token-key-min-32-characters-change-this
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://app.ricemillsaas.com

# Logging
LOG_LEVEL=info

# Rate Limiting
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads/

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=Rice Mill SaaS <noreply@ricemillsaas.com>

# SMS (Optional)
SMS_API_KEY=your-sms-api-key
SMS_API_URL=https://api.sms-provider.com/send

# Error Monitoring (Optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Cloud Storage (Optional)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=ricemill-uploads
```

---

## 2. Docker Configuration

### Dockerfile

```dockerfile
# Dockerfile
FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json* ./

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Production stage
FROM base AS production
WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Copy dependencies and source
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown nodejs:nodejs logs

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/v1/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start production server
CMD ["node", "src/server.js"]
```

### docker-compose.yml

```yaml
# docker-compose.yml
version: '3.8'

services:
  # MongoDB
  mongo:
    image: mongo:7
    container_name: ricemill-mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: ricemill
    ports:
      - '27017:27017'
    volumes:
      - mongo-data:/data/db
      - mongo-config:/data/configdb
    networks:
      - ricemill-network
    healthcheck:
      test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")']
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis (Optional - for caching)
  # redis:
  #   image: redis:7-alpine
  #   container_name: ricemill-redis
  #   restart: unless-stopped
  #   ports:
  #     - '6379:6379'
  #   volumes:
  #     - redis-data:/data
  #   networks:
  #     - ricemill-network

  # API Server
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    container_name: ricemill-api
    restart: unless-stopped
    env_file:
      - .env
    environment:
      MONGODB_URI: mongodb://admin:password123@mongo:27017/ricemill?authSource=admin
    ports:
      - '5000:5000'
    volumes:
      - ./logs:/app/logs
      - ./uploads:/app/uploads
    depends_on:
      mongo:
        condition: service_healthy
    networks:
      - ricemill-network
    healthcheck:
      test: ['CMD', 'wget', '--no-verbose', '--tries=1', '--spider', 'http://localhost:5000/api/v1/health']
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

volumes:
  mongo-data:
  mongo-config:
  # redis-data:

networks:
  ricemill-network:
    driver: bridge
```

### docker-compose.dev.yml

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  mongo:
    image: mongo:7
    container_name: ricemill-mongo-dev
    restart: unless-stopped
    environment:
      MONGO_INITDB_DATABASE: ricemill_dev
    ports:
      - '27017:27017'
    volumes:
      - mongo-data-dev:/data/db
    networks:
      - ricemill-dev-network

  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: ricemill-api-dev
    restart: unless-stopped
    env_file:
      - .env
    environment:
      NODE_ENV: development
      MONGODB_URI: mongodb://mongo:27017/ricemill_dev
    ports:
      - '5000:5000'
    volumes:
      - ./src:/app/src
      - ./logs:/app/logs
      - /app/node_modules
    depends_on:
      - mongo
    networks:
      - ricemill-dev-network

volumes:
  mongo-data-dev:

networks:
  ricemill-dev-network:
    driver: bridge
```

---

## 3. GitHub Actions CI/CD

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [20.x, 22.x]

    steps:
      - uses: actions/checkout@v4

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella
```

### .github/workflows/deploy.yml

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/ricemill-api:latest

      - name: Deploy to production server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /opt/ricemill
            docker-compose pull
            docker-compose up -d
            docker system prune -f
```

---

## 4. Nginx Configuration

### nginx.conf

```nginx
# /etc/nginx/sites-available/ricemill-api
upstream ricemill_api {
    least_conn;
    server localhost:5000 max_fails=3 fail_timeout=30s;
    server localhost:5001 max_fails=3 fail_timeout=30s; # If running multiple instances
}

server {
    listen 80;
    server_name api.ricemillsaas.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.ricemillsaas.com;

    # SSL Certificates
    ssl_certificate /etc/letsencrypt/live/api.ricemillsaas.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.ricemillsaas.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/ricemill-api-access.log;
    error_log /var/log/nginx/ricemill-api-error.log;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy settings
    location / {
        proxy_pass http://ricemill_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # WebSocket support for Socket.io
    location /socket.io/ {
        proxy_pass http://ricemill_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket timeout
        proxy_read_timeout 86400;
    }

    # Health check endpoint
    location /api/v1/health {
        proxy_pass http://ricemill_api;
        access_log off;
    }

    # Static files caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        proxy_pass http://ricemill_api;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 5. Production Deployment Script

### deploy.sh

```bash
#!/bin/bash

# Production Deployment Script
set -e

echo "🚀 Starting deployment..."

# Pull latest code
echo "📥 Pulling latest code from GitHub..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run database migrations (if any)
# echo "🗄️  Running database migrations..."
# npm run migrate

# Build Docker image
echo "🐳 Building Docker image..."
docker-compose build --no-cache

# Stop old containers
echo "⏸️  Stopping old containers..."
docker-compose down

# Start new containers
echo "▶️  Starting new containers..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Health check
echo "🏥 Performing health check..."
curl -f http://localhost:5000/api/v1/health || exit 1

# Clean up old Docker images
echo "🧹 Cleaning up old Docker images..."
docker system prune -f

echo "✅ Deployment completed successfully!"
```

---

## 6. Monitoring & Alerting

### PM2 Configuration (Alternative to Docker)

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'ricemill-api',
      script: './src/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      max_memory_restart: '1G',
      kill_timeout: 5000,
    },
  ],
};
```

---

## 7. Database Backup Script

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backups/mongodb"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="ricemill_backup_${TIMESTAMP}.gz"

echo "🗄️  Starting MongoDB backup..."

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Dump database
mongodump --uri="mongodb://admin:password@localhost:27017/ricemill?authSource=admin" --gzip --archive=$BACKUP_DIR/$BACKUP_FILE

# Keep only last 7 days of backups
find $BACKUP_DIR -type f -name "*.gz" -mtime +7 -delete

echo "✅ Backup completed: $BACKUP_FILE"
```

### Cron Job for Daily Backups

```bash
# Add to crontab (crontab -e)
0 2 * * * /opt/ricemill/backup-db.sh >> /var/log/ricemill-backup.log 2>&1
```

---

## 8. Production Checklist

### Pre-Deployment

- [ ] Environment variables configured
- [ ] JWT secrets are strong and different
- [ ] MongoDB URI points to production database
- [ ] CORS origins configured correctly
- [ ] Rate limiting enabled
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Firewall rules configured
- [ ] Backup strategy implemented

### Security

- [ ] All secrets stored securely (not in code)
- [ ] HTTPS enforced
- [ ] Strong password policy
- [ ] Rate limiting on all endpoints
- [ ] Input validation with Zod
- [ ] MongoDB sanitization enabled
- [ ] Helmet security headers configured
- [ ] Error messages don't expose sensitive info
- [ ] Audit logging enabled

### Performance

- [ ] Database indexes created
- [ ] Query optimization done
- [ ] Caching strategy implemented (if needed)
- [ ] Connection pooling configured
- [ ] Load balancing configured (if needed)
- [ ] CDN configured for static assets (if any)

### Monitoring

- [ ] Error monitoring (Sentry) configured
- [ ] Application logging enabled
- [ ] Database backup automated
- [ ] Health check endpoint working
- [ ] Uptime monitoring configured
- [ ] Alert system setup

---

## 9. Troubleshooting

### Common Issues

#### Container won't start

```bash
# Check logs
docker logs ricemill-api

# Check MongoDB connection
docker exec -it ricemill-mongo mongosh

# Restart containers
docker-compose restart
```

#### Database connection issues

```bash
# Check MongoDB status
docker exec -it ricemill-mongo mongosh --eval "db.adminCommand('ping')"

# Verify environment variables
docker exec ricemill-api printenv | grep MONGO
```

#### High memory usage

```bash
# Check memory usage
docker stats

# Restart specific service
docker-compose restart api
```

---

## 10. Scaling Strategies

### Horizontal Scaling

1. **Load Balancer** (Nginx/HAProxy)
2. **Multiple API Instances** (Docker Swarm or Kubernetes)
3. **MongoDB Replica Set** (for high availability)
4. **Redis for Session Management**
5. **CDN for Static Assets**

### Vertical Scaling

- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching
- Use connection pooling

---

## Conclusion

Your Rice Mill SaaS backend is now ready for production deployment with:
- ✅ Modular, scalable architecture
- ✅ Secure authentication (JWT with token rotation)
- ✅ Real-time features (Socket.io)
- ✅ Comprehensive error handling & logging
- ✅ Testing suite (Unit + Integration)
- ✅ Docker containerization
- ✅ CI/CD pipeline
- ✅ Production-ready configuration

**Next Steps:**
1. Deploy to staging environment first
2. Run smoke tests
3. Monitor for 24 hours
4. Deploy to production
5. Set up monitoring & alerts

---

**Need Help?**
- Documentation: [Confluence/Wiki]
- Support: support@ricemillsaas.com
- GitHub: [Repository Issues]
