# 🚀 Complete EC2 Deployment Guide for GroceryMart

This guide covers step-by-step deployment on AWS EC2 instances with fixes for common errors.

## 📋 Prerequisites

1. AWS Account
2. AWS CLI installed and configured
3. Terraform installed (optional, for automated setup)
4. SSH key pair (.pem file)

## 🎯 Option 1: Quick Manual Deployment (Recommended for First Time)

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2 → Launch Instance**
2. **Configure Instance:**
   - Name: `grocery-mart-server`
   - AMI: Ubuntu 22.04 LTS
   - Instance Type: `t3.medium` (2 vCPU, 4GB RAM) or larger
   - Key Pair: Select or create new key pair
   - Network Settings: Create security group with:
     - SSH (22) from My IP
     - HTTP (80) from anywhere (0.0.0.0/0)
     - HTTPS (443) from anywhere (0.0.0.0/0)
     - Custom TCP (3000) from anywhere (for API)
     - Custom TCP (8081) from anywhere (for Mongo Express)
   - Storage: 30GB minimum

3. **Launch Instance and note the Public IP**

### Step 2: Connect to EC2 Instance

```bash
# On Windows (PowerShell)
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>

# If permission denied, fix key permissions (Linux/Mac)
chmod 400 your-key.pem
```

### Step 3: Update System and Install Prerequisites

```bash
# Update system
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    python3-pip
```

### Step 4: Install Docker

```bash
# Remove old versions
sudo apt-get remove -y docker docker-engine docker.io containerd runc

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo apt-get install -y docker-compose-plugin

# Logout and login again for group changes to take effect
# Or use: newgrp docker
```

### Step 5: Clone and Setup Project

```bash
# Create application directory
cd /opt
sudo mkdir -p grocery-mart
sudo chown ubuntu:ubuntu grocery-mart
cd grocery-mart

# Option A: Clone from Git (if you have repository)
# git clone <your-repo-url> .

# Option B: Upload files via SCP (from your local machine)
# scp -i "your-key.pem" -r /path/to/grocery-mart/* ubuntu@<EC2_IP>:/opt/grocery-mart/

# Option C: Create files directly on server
# (We'll use this method - see Step 6)
```

### Step 6: Create Application Files

Create all necessary files on the EC2 instance. You can copy from your local machine using SCP or create them directly.

```bash
# Create directory structure
mkdir -p frontend/css frontend/js backend/models backend/routes backend/middleware backend/scripts

# You'll need to upload all project files here
```

### Step 7: Fix Common Issues

#### Fix 1: Update MongoDB Connection String

Edit `docker-compose.yml`:

```yaml
MONGODB_URI: mongodb://mongo:27017/grocerymart
```

This is already correct for Docker Compose.

#### Fix 2: Create .env File

```bash
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
```

#### Fix 3: Fix Docker Compose File

The docker-compose.yml should work, but ensure volumes are properly configured:

```bash
# Check docker-compose.yml exists and is correct
cat docker-compose.yml
```

### Step 8: Build and Start Services

```bash
# Build and start all services
docker compose up -d --build

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Step 9: Seed Database

```bash
# Wait for MongoDB to be ready (about 30 seconds)
sleep 30

# Seed the database
docker exec -it grocery-backend npm run seed
```

### Step 10: Verify Deployment

```bash
# Check all containers are running
docker ps

# Check logs
docker logs grocery-backend
docker logs grocery-frontend
docker logs grocery-mongo

# Test endpoints
curl http://localhost/api/products
curl http://localhost
```

### Step 11: Access Application

- **Frontend**: `http://<EC2_PUBLIC_IP>`
- **Backend API**: `http://<EC2_PUBLIC_IP>/api/products`
- **Mongo Express**: `http://<EC2_PUBLIC_IP>:8081` (admin/admin123)

---

## 🎯 Option 2: Automated Deployment with Terraform + Ansible

### Step 1: Provision Infrastructure with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Review plan
terraform plan

# Apply (creates EC2 instance)
terraform apply

# Note the EC2 public IP from output
terraform output ec2_public_ip
```

### Step 2: Update Ansible Inventory

```bash
cd ../ansible

# Edit inventory.ini with EC2 IP
nano inventory.ini
```

Update:
```ini
jenkins_server ansible_host=<EC2_PUBLIC_IP> ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/grocery-mart-key.pem
```

### Step 3: Run Ansible Playbook

```bash
# Test connectivity
ansible all -i inventory.ini -m ping

# Run playbook
ansible-playbook -i inventory.ini playbook.yml
```

---

## 🔧 Common Errors and Fixes

### Error 1: Permission Denied (SSH)

```bash
# Fix key permissions
chmod 400 your-key.pem

# Use correct user (ubuntu for Ubuntu AMI)
ssh -i "your-key.pem" ubuntu@<EC2_IP>
```

### Error 2: Port Already in Use

```bash
# Check what's using the port
sudo netstat -tlnp | grep :3000
# or
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change port in docker-compose.yml
```

### Error 3: MongoDB Connection Failed

**Fix**: Ensure MongoDB container is running:

```bash
docker ps | grep mongo

# If not running, check logs
docker logs grocery-mongo

# Restart MongoDB
docker restart grocery-mongo
```

**Update connection string** in `server.js` or environment:

```javascript
// For Docker Compose
MONGODB_URI=mongodb://mongo:27017/grocerymart

// For local MongoDB
MONGODB_URI=mongodb://localhost:27017/grocerymart
```

### Error 4: Docker Permission Denied

```bash
# Add user to docker group
sudo usermod -aG docker ubuntu

# Reload groups
newgrp docker

# Or logout and login again
```

### Error 5: Cannot Access Application from Browser

**Check Security Group:**
1. Go to EC2 Console → Security Groups
2. Edit inbound rules
3. Ensure port 80 is open from 0.0.0.0/0

**Check Docker Ports:**
```bash
# Verify containers are listening
docker ps
sudo netstat -tlnp | grep :80
```

### Error 6: Out of Memory

```bash
# Check memory
free -h

# Stop unnecessary services
sudo systemctl stop snapd

# Upgrade instance type in AWS Console
```

### Error 7: npm install fails

**Fix**: Increase Node memory:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm install
```

### Error 8: Docker Build Fails

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache
```

---

## 📝 Step-by-Step Deployment Script

Create this script for automated deployment:

```bash
#!/bin/bash
# Save as: deploy-ec2.sh

set -e

echo "🚀 Starting GroceryMart Deployment on EC2..."

# Update system
echo "📦 Updating system..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose
echo "📦 Installing Docker Compose..."
sudo apt-get install -y docker-compose-plugin

# Create application directory
echo "📁 Creating application directory..."
cd /opt
sudo mkdir -p grocery-mart
sudo chown ubuntu:ubuntu grocery-mart
cd grocery-mart

# Create .env file
echo "⚙️ Creating .env file..."
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

echo "✅ Setup complete! Now:"
echo "1. Upload your project files to /opt/grocery-mart"
echo "2. Run: docker compose up -d --build"
echo "3. Run: docker exec -it grocery-backend npm run seed"
```

**Usage:**
```bash
# Make executable
chmod +x deploy-ec2.sh

# Run
./deploy-ec2.sh
```

---

## 🔒 Security Best Practices

1. **Update Security Group**: Only open necessary ports
2. **Use HTTPS**: Setup SSL certificate (Let's Encrypt)
3. **Change Default Passwords**: Update admin credentials
4. **Enable Firewall**: 
   ```bash
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw enable
   ```
5. **Regular Updates**: 
   ```bash
   sudo apt-get update && sudo apt-get upgrade -y
   ```

---

## 📊 Monitoring and Logs

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker logs -f grocery-backend
docker logs -f grocery-frontend
docker logs -f grocery-mongo
```

### Check Health

```bash
# Container status
docker ps

# Resource usage
docker stats

# Test API
curl http://localhost/api/products
```

---

## 🔄 Updating Application

```bash
cd /opt/grocery-mart

# Pull latest code (if using git)
git pull

# Rebuild and restart
docker compose down
docker compose up -d --build

# Re-seed database (if needed)
docker exec -it grocery-backend npm run seed
```

---

## 💾 Backup Database

```bash
# Backup MongoDB
docker exec grocery-mongo mongodump --out /data/backup
docker cp grocery-mongo:/data/backup ./backup-$(date +%Y%m%d)

# Restore
docker cp ./backup-20240101 grocery-mongo:/data/backup
docker exec grocery-mongo mongorestore /data/backup
```

---

## 🆘 Troubleshooting Commands

```bash
# Check system resources
df -h          # Disk space
free -h        # Memory
top            # CPU/Memory usage

# Check Docker
docker ps      # Running containers
docker images  # Available images
docker system df  # Docker disk usage

# Check network
netstat -tlnp  # Listening ports
curl localhost/api/products  # Test API

# Check logs
journalctl -xe  # System logs
docker logs <container>  # Container logs
```

---

## ✅ Deployment Checklist

- [ ] EC2 instance launched
- [ ] Security groups configured
- [ ] SSH access working
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Project files uploaded
- [ ] .env file created
- [ ] Docker containers running
- [ ] Database seeded
- [ ] Application accessible via browser
- [ ] Security group allows HTTP traffic
- [ ] Firewall configured
- [ ] Backups scheduled

---

## 📞 Need Help?

1. Check logs: `docker compose logs`
2. Verify security groups in AWS Console
3. Test locally first: `docker compose up` on your machine
4. Check MongoDB connection string
5. Verify all environment variables are set

---

**🎉 Your GroceryMart application should now be running on EC2!**

Access at: `http://<EC2_PUBLIC_IP>`

