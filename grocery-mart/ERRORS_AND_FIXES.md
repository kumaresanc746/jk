# 🔧 Common Errors and Fixes for EC2 Deployment

This document lists common errors you might encounter when deploying GroceryMart on EC2 and their solutions.

## 🔴 Critical Errors

### Error 1: MongoDB Connection Failed

**Symptoms:**
```
MongoDB Connection Error: connect ECONNREFUSED
```

**Causes:**
- MongoDB container not running
- Wrong connection string
- Network connectivity issues
- Port blocked by firewall

**Fixes:**

```bash
# Check if MongoDB container is running
docker ps | grep mongo

# If not running, start it
docker compose up -d mongo

# Check MongoDB logs
docker logs grocery-mongo

# Verify connection string in docker-compose.yml
# Should be: mongodb://mongo:27017/grocerymart

# Test MongoDB connection
docker exec -it grocery-mongo mongosh --eval "db.adminCommand('ping')"
```

**Update connection string:**
- For Docker Compose: `mongodb://mongo:27017/grocerymart` ✅
- For local MongoDB: `mongodb://localhost:27017/grocerymart`
- For remote MongoDB: `mongodb://username:password@host:27017/grocerymart`

---

### Error 2: Port Already in Use

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fixes:**

```bash
# Find process using port 3000
sudo lsof -i :3000
# or
sudo netstat -tlnp | grep :3000

# Kill the process
sudo kill -9 <PID>

# Or kill all Node processes
sudo pkill -f node

# Change port in .env file
echo "PORT=3001" >> .env
```

---

### Error 3: Permission Denied (Docker)

**Symptoms:**
```
Got permission denied while trying to connect to the Docker daemon socket
```

**Fixes:**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Apply changes (choose one):
newgrp docker
# OR logout and login again

# Verify
docker ps

# If still not working, fix socket permissions
sudo chmod 666 /var/run/docker.sock
```

---

### Error 4: Cannot Access Application from Browser

**Symptoms:**
- Page doesn't load
- Connection timeout
- ERR_CONNECTION_REFUSED

**Fixes:**

1. **Check Security Group in AWS Console:**
   - Go to EC2 → Security Groups
   - Edit inbound rules
   - Add rule: HTTP (80) from 0.0.0.0/0
   - Add rule: Custom TCP (3000) from 0.0.0.0/0

2. **Check if containers are running:**
   ```bash
   docker ps
   ```

3. **Check if ports are listening:**
   ```bash
   sudo netstat -tlnp | grep :80
   sudo netstat -tlnp | grep :3000
   ```

4. **Check EC2 firewall:**
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp
   sudo ufw allow 3000/tcp
   ```

5. **Verify public IP:**
   ```bash
   curl http://checkip.amazonaws.com
   ```

---

### Error 5: Out of Memory

**Symptoms:**
```
JavaScript heap out of memory
FATAL ERROR: Reached heap limit
```

**Fixes:**

```bash
# Check memory
free -h

# Increase Node memory limit
export NODE_OPTIONS="--max-old-space-size=2048"

# Or in docker-compose.yml, add:
environment:
  NODE_OPTIONS: "--max-old-space-size=2048"

# Upgrade EC2 instance type:
# t3.small (2GB) → t3.medium (4GB) or larger
```

---

### Error 6: Disk Space Full

**Symptoms:**
```
No space left on device
```

**Fixes:**

```bash
# Check disk usage
df -h

# Clean Docker system
docker system prune -a --volumes

# Clean apt cache
sudo apt-get clean
sudo apt-get autoremove

# Remove old logs
sudo journalctl --vacuum-time=3d

# Increase EBS volume in AWS Console if needed
```

---

### Error 7: Docker Build Fails

**Symptoms:**
```
ERROR [internal] load build context
ERROR failed to solve
```

**Fixes:**

```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker compose build --no-cache

# Check Dockerfile syntax
cat Dockerfile.backend

# Verify files exist
ls -la backend/
ls -la package.json

# Check disk space
df -h
```

---

### Error 8: npm install Fails

**Symptoms:**
```
npm ERR! network timeout
npm ERR! code ELIFECYCLE
```

**Fixes:**

```bash
# Clear npm cache
npm cache clean --force

# Increase timeout
npm install --timeout=60000

# Use different registry
npm install --registry https://registry.npmjs.org/

# Check internet connection
ping google.com

# If behind proxy, configure npm
npm config set proxy http://proxy:port
npm config set https-proxy http://proxy:port
```

---

## 🟡 Warning-Level Errors

### Warning 1: Deprecated MongoDB Options

**Symptoms:**
```
(node:1234) DeprecationWarning: ...
```

**Fix:** Already handled in server.js with proper options.

---

### Warning 2: CORS Errors

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Fix:** CORS is enabled in server.js. If still occurring:

```javascript
// In server.js, update CORS config:
app.use(cors({
  origin: '*', // Or specific origins
  credentials: true
}));
```

---

## 🟢 Minor Issues

### Issue 1: Slow Startup

**Fix:**
```bash
# Optimize MongoDB startup
# In docker-compose.yml, add to mongo service:
command: mongod --wiredTigerCacheSizeGB 1
```

---

### Issue 2: Logs Too Verbose

**Fix:**
```bash
# View specific service logs only
docker logs -f grocery-backend --tail=50
```

---

## 📝 Quick Fix Script

Run this script to fix common issues:

```bash
chmod +x scripts/fix-common-errors.sh
./scripts/fix-common-errors.sh
```

## 🔍 Diagnostic Commands

```bash
# Check all containers
docker ps -a

# Check container logs
docker logs <container-name>

# Check system resources
top
free -h
df -h

# Check network
netstat -tlnp
curl localhost/api/products

# Check MongoDB
docker exec -it grocery-mongo mongosh --eval "db.stats()"

# Check environment variables
docker exec grocery-backend env | grep MONGO
```

## 🆘 Still Having Issues?

1. **Check all logs:**
   ```bash
   docker compose logs
   ```

2. **Restart all services:**
   ```bash
   docker compose down
   docker compose up -d
   ```

3. **Verify configuration:**
   - Check `.env` file exists
   - Check `docker-compose.yml` syntax
   - Check all required files are present

4. **Start fresh:**
   ```bash
   docker compose down -v  # Removes volumes too
   docker compose up -d --build
   ```

5. **Contact Support:**
   - Review deployment guide
   - Check AWS EC2 console
   - Verify security groups
   - Check instance status

---

**Remember:** Always check logs first - they usually tell you what's wrong!

```bash
docker compose logs -f
```

