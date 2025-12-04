#!/bin/bash
# Update Deployment Script - Use this to update your application

set -e

APP_DIR="/opt/grocery-mart"
cd $APP_DIR

echo "🔄 Updating GroceryMart Deployment..."

# Option 1: Git pull (if using git)
if [ -d .git ]; then
    echo "📥 Pulling latest code from git..."
    git pull
else
    echo "⚠️  Not a git repository. Please manually update files."
    echo "   You can use SCP to upload files:"
    echo "   scp -i key.pem -r /local/path/* ubuntu@EC2_IP:/opt/grocery-mart/"
    read -p "Press Enter after updating files..."
fi

# Rebuild and restart
echo "🔨 Rebuilding containers..."
sudo docker compose down
sudo docker compose up -d --build

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 10

# Check status
echo "📊 Container status:"
sudo docker compose ps

# Show logs
echo ""
echo "📋 Recent logs:"
sudo docker compose logs --tail=20

echo ""
echo "✅ Update complete!"
echo "Access at: http://$(curl -s http://checkip.amazonaws.com)"

