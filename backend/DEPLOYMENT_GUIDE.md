# Smart Griev Deployment Guide

Complete guide for deploying Smart Griev backend to production.

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] SSL/TLS certificates obtained
- [ ] Email service configured
- [ ] Cloud storage configured
- [ ] Monitoring and logging setup
- [ ] Backup strategy defined
- [ ] Security audit completed
- [ ] Load testing done

## Local Development

```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

## Docker Deployment

### Quick Start with Docker Compose

```bash
docker-compose up -d
```

This starts:
- PostgreSQL (port 5432)
- Redis (port 6379)
- FastAPI backend (port 8000)
- PgAdmin (port 5050)

### Manual Docker Build

```bash
# Build
docker build -t smartgriev-api:latest .

# Run
docker run -p 8000:8000 \
  --env-file .env \
  --name smartgriev-api \
  smartgriev-api:latest
```

## Production Deployment

### 1. Using AWS EC2

#### Prerequisites
- EC2 instance (t3.medium or larger)
- Ubuntu 22.04 LTS
- Security groups configured
- SSL certificate (AWS Certificate Manager)

#### Setup

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
git clone <repository> /opt/smartgriev
cd /opt/smartgriev/backend

# Configure environment
sudo cp .env.example .env
sudo nano .env  # Edit configuration

# Run with Docker Compose
sudo docker-compose -f docker-compose.yml up -d
```

### 2. Using Heroku

```bash
# Login
heroku login

# Create app
heroku create smartgriev-api

# Configure buildpack
heroku buildpacks:add heroku/python

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DATABASE_URL=your-db-url
# ... other environment variables

# Deploy
git push heroku main

# Run migrations
heroku run "python -m alembic upgrade head"

# View logs
heroku logs --tail
```

### 3. Using DigitalOcean App Platform

1. Connect GitHub repository
2. Create new app
3. Configure environment variables
4. Set resource allocation (basic/professional)
5. Deploy

### 4. Using Google Cloud Run

```bash
# Configure gcloud
gcloud auth login
gcloud config set project PROJECT_ID

# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/smartgriev-api

# Deploy
gcloud run deploy smartgriev-api \
  --image gcr.io/PROJECT_ID/smartgriev-api \
  --platform managed \
  --region us-central1 \
  --set-env-vars "DATABASE_URL=...,SECRET_KEY=..."
```

## Database Setup

### PostgreSQL on AWS RDS

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier smartgriev-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --master-user-password <secure-password>

# Run migrations
python -m alembic upgrade head
```

### Database Backup

```bash
# Manual backup
pg_dump -U admin smartgriev_db > backup_$(date +%Y%m%d).sql

# Restore
psql -U admin smartgriev_db < backup_20240101.sql

# Automated backups (AWS RDS)
# Configure in RDS console: Automated backups enabled, retention 30 days
```

## Redis Setup

### AWS ElastiCache

```bash
# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id smartgriev-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --engine-version 7.0
```

## Email Service Configuration

### SendGrid

```bash
# Get API key from SendGrid console
# Add to .env
SENDGRID_API_KEY=sg_...
SENDGRID_FROM_EMAIL=noreply@smartgriev.com
```

### AWS SES

```bash
# Configure credentials
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# In settings:
EMAIL_SERVICE=aws-ses
SES_REGION=us-east-1
```

## Cloud Storage Setup

### AWS S3

```bash
# Create bucket
aws s3 mb s3://smartgriev-attachments

# Configure lifecycle policy
aws s3api put-bucket-lifecycle-configuration \
  --bucket smartgriev-attachments \
  --lifecycle-configuration file://lifecycle.json
```

### Google Cloud Storage

```bash
# Create bucket
gsutil mb gs://smartgriev-attachments

# Configure permissions
gsutil iam ch serviceAccount:app@project.iam.gserviceaccount.com:objectCreator gs://smartgriev-attachments
```

## Monitoring & Logging

### Google Cloud Logging

```python
# Automatic logging to Cloud Logging
from google.cloud import logging as cloud_logging

client = cloud_logging.Client()
client.setup_logging()
```

### ELK Stack (Elasticsearch, Logstash, Kibana)

```bash
# Docker Compose includes ELK configuration
docker-compose -f docker-compose.elk.yml up -d
```

### Datadog

```bash
# Install agent
DD_AGENT_MAJOR_VERSION=7 \
DD_API_KEY=<your-api-key> \
DD_SITE=datadoghq.com \
bash -c "$(curl -L https://s3.amazonaws.com/datadog-agent/scripts/install_agent.sh)"
```

### CloudWatch (AWS)

Logs automatically sent if running on AWS with proper IAM role.

## Security

### SSL/TLS Certificate

```bash
# Using Let's Encrypt with Certbot
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --standalone -d api.smartgriev.com
```

### Rate Limiting

Add to nginx configuration:

```nginx
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;

location /api {
    limit_req zone=api burst=20 nodelay;
}
```

### WAF (Web Application Firewall)

For AWS:
```bash
# Create WAF rules
aws wafv2 create-web-acl ...
```

## Scaling

### Horizontal Scaling

```bash
# Docker Swarm
docker swarm init
docker service create --replicas 3 -p 8000:8000 smartgriev-api

# Kubernetes
kubectl apply -f smartgriev-deployment.yaml
```

### Load Balancing

```nginx
upstream smartgriev_backend {
    server 10.0.1.10:8000;
    server 10.0.1.11:8000;
    server 10.0.1.12:8000;
}

server {
    listen 80;
    server_name api.smartgriev.com;

    location / {
        proxy_pass http://smartgriev_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Monitoring & Alerting

### Health Checks

```bash
# Configure health check endpoint
curl http://localhost:8000/health

# AWS ALB health check configuration
Health check endpoint: /health
Healthy threshold: 2
Unhealthy threshold: 3
Timeout: 5 seconds
Interval: 30 seconds
```

### Alert Rules

```yaml
# Example Prometheus alert
groups:
- name: smartgriev
  rules:
  - alert: APIDown
    expr: up{job="smartgriev-api"} == 0
    for: 5m
    
  - alert: HighErrorRate
    expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
```

## Performance Tuning

### PostgreSQL

```sql
-- Increase connection pool
max_connections = 200

-- Optimize memory
shared_buffers = 1GB
effective_cache_size = 4GB

-- Increase WAL
wal_buffers = 16MB

-- Analyze and vacuum
VACUUM ANALYZE;
```

### Redis

```conf
# redis.conf
maxmemory 1gb
maxmemory-policy allkeys-lru
```

### Application

```python
# Enable connection pooling
DATABASE_URL = "postgresql://user:pass@host/db?pool_size=20&max_overflow=40"

# Enable compression
gzip_compression_level = 6
```

## Disaster Recovery

### RTO/RPO Targets

- RTO (Recovery Time Objective): < 1 hour
- RPO (Recovery Point Objective): < 5 minutes

### Backup Strategy

```bash
# Daily backups
0 2 * * * /opt/smartgriev/scripts/backup.sh

# Weekly full backups to separate location
0 3 * * 0 aws s3 sync /var/backups s3://smartgriev-backups/weekly/$(date +%Y%m%d)

# Monthly archive
0 4 1 * * aws s3 sync /var/backups s3://smartgriev-backups/monthly/$(date +%Y%m)
```

### Restoration Test

```bash
# Monthly restoration test
# 1. Restore to staging environment
# 2. Verify data integrity
# 3. Run smoke tests
# 4. Document time taken
```

## Post-Deployment

### Verification

```bash
# Test health
curl https://api.smartgriev.com/health

# Test authentication
curl -X POST https://api.smartgriev.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test"}'

# Check logs
docker logs smartgriev-api

# Monitor metrics
# Visit Grafana/Datadog dashboard
```

### Cleanup

```bash
# Remove old deployments
docker system prune -a

# Remove unused volumes
docker volume prune
```

## Maintenance

### Regular Tasks

- Daily: Monitor logs and metrics
- Weekly: Review security alerts
- Monthly: Run backups verification
- Quarterly: Security audit
- Semi-annually: Dependency updates

### Update Procedure

```bash
# 1. Update dependencies
pip install -U -r requirements.txt

# 2. Run tests
pytest tests/ -v

# 3. Deploy to staging
docker build -t smartgriev-api:staging .

# 4. Run smoke tests
./tests/smoke_tests.sh

# 5. Deploy to production
docker tag smartgriev-api:staging smartgriev-api:latest
docker push smartgriev-api:latest
```

## Troubleshooting

### High CPU Usage

```bash
# Check processes
top -b -n 1 | head -20

# Profile application
python -m cProfile -o app.prof app/main.py
```

### Database Connection Errors

```bash
# Check connection
psql -h hostname -U username -d database

# Check pool status
SELECT count(*) FROM pg_stat_activity;
```

### Memory Leaks

```bash
# Monitor memory
docker stats smartgriev-api

# Check for memory leaks
python -m memory_profiler app.py
```

## Support

- Documentation: https://docs.smartgriev.com
- Issues: https://github.com/smartgriev/backend/issues
- Email: support@smartgriev.com
