#!/bin/bash
# Fix Common Errors Script for GroceryMart on EC2

set -e

echo "🔧 Fixing Common Errors..."

# Fix 1: Docker permission denied
echo "1. Fixing Docker permissions..."
sudo usermod -aG docker $USER
newgrp docker

# Fix 2: Port conflicts
echo "2. Checking for port conflicts..."
PORTS=(80 3000 27017 8081)
for port in "${PORTS[@]}"; do
    PID=$(sudo lsof -t -i:$port 2>/dev/null || true)
    if [ ! -z "$PID" ]; then
        echo "   Port $port is in use by PID $PID"
        read -p "   Kill process? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            sudo kill -9 $PID
            echo "   ✓ Process killed"
        fi
    fi
done

# Fix 3: MongoDB connection issues
echo "3. Checking MongoDB connection..."
if sudo docker ps | grep -q grocery-mongo; then
    echo "   ✓ MongoDB container is running"
    # Restart MongoDB if needed
    if ! sudo docker exec grocery-mongo mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        echo "   Restarting MongoDB..."
        sudo docker restart grocery-mongo
        sleep 5
    fi
else
    echo "   ✗ MongoDB container not found"
    echo "   Starting containers..."
    cd /opt/grocery-mart
    sudo docker compose up -d
fi

# Fix 4: Clear Docker cache if low on space
echo "4. Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    echo "   Disk usage is ${DISK_USAGE}%"
    read -p "   Clean Docker cache? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        sudo docker system prune -f
        echo "   ✓ Docker cache cleaned"
    fi
fi

# Fix 5: Fix file permissions
echo "5. Fixing file permissions..."
cd /opt/grocery-mart
sudo chown -R $USER:$USER .
sudo chmod +x scripts/*.sh 2>/dev/null || true

# Fix 6: Update .env if missing
if [ ! -f .env ]; then
    echo "6. Creating .env file..."
    cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
    echo "   ✓ .env file created"
else
    echo "6. ✓ .env file exists"
fi

# Fix 7: Restart containers
echo "7. Restarting containers..."
cd /opt/grocery-mart
sudo docker compose restart

echo ""
echo "✅ All fixes applied!"
echo ""
echo "Checking container status:"
sudo docker compose ps

