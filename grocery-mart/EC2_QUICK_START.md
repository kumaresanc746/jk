# ⚡ EC2 Quick Start Guide

Get your GroceryMart application running on EC2 in 10 minutes!

## 🚀 Fastest Deployment Method

### Step 1: Launch EC2 Instance (5 minutes)

1. **AWS Console → EC2 → Launch Instance**
   - AMI: Ubuntu 22.04 LTS
   - Instance: t3.medium (or larger)
   - Key Pair: Create/download .pem file
   - Security Group: Allow ports 22, 80, 3000, 8081
   - Launch

2. **Note your Public IP**

### Step 2: Connect to EC2

```bash
ssh -i "your-key.pem" ubuntu@<EC2_PUBLIC_IP>
```

### Step 3: Run Deployment Script

```bash
# Download and run deployment script
curl -fsSL https://raw.githubusercontent.com/your-repo/grocery-mart/main/scripts/deploy-ec2.sh -o deploy.sh
chmod +x deploy.sh
./deploy.sh
```

**OR manually:**

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu
newgrp docker

# Install Docker Compose
sudo apt-get install -y docker-compose-plugin

# Create app directory
sudo mkdir -p /opt/grocery-mart
sudo chown ubuntu:ubuntu /opt/grocery-mart
cd /opt/grocery-mart
```

### Step 4: Upload Project Files

**From your local machine:**

```bash
# Upload entire project
scp -i "your-key.pem" -r /path/to/grocery-mart/* ubuntu@<EC2_IP>:/opt/grocery-mart/

# Or use rsync (better for large files)
rsync -avz -e "ssh -i your-key.pem" /path/to/grocery-mart/ ubuntu@<EC2_IP>:/opt/grocery-mart/
```

### Step 5: Deploy

```bash
cd /opt/grocery-mart

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF

# Start services
docker compose up -d --build

# Wait 30 seconds for MongoDB
sleep 30

# Seed database
docker exec -it grocery-backend npm run seed
```

### Step 6: Access Your App! 🎉

- Frontend: `http://<EC2_PUBLIC_IP>`
- API: `http://<EC2_PUBLIC_IP>/api/products`
- Mongo Express: `http://<EC2_PUBLIC_IP>:8081` (admin/admin123)

---

## 🔧 If Something Goes Wrong

```bash
# Check logs
docker compose logs

# Check status
docker compose ps

# Restart
docker compose restart

# Run fix script
chmod +x scripts/fix-common-errors.sh
./scripts/fix-common-errors.sh
```

See [ERRORS_AND_FIXES.md](ERRORS_AND_FIXES.md) for detailed error solutions.

---

## 📋 Checklist

- [ ] EC2 instance launched
- [ ] Security group allows ports 22, 80, 3000, 8081
- [ ] Connected via SSH
- [ ] Docker installed
- [ ] Project files uploaded
- [ ] Containers running
- [ ] Database seeded
- [ ] Application accessible

---

**Done! Your app should now be live! 🚀**

For detailed instructions, see [EC2_DEPLOYMENT_GUIDE.md](EC2_DEPLOYMENT_GUIDE.md)

