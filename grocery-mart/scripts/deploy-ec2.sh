#!/bin/bash
# EC2 Deployment Script for GroceryMart
# This script automates the deployment process on Ubuntu EC2 instances

set -e  # Exit on error

echo "🚀 Starting GroceryMart Deployment on EC2..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then 
    print_error "Please run this script as a regular user (not root)"
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install required packages
print_status "Installing required packages..."
sudo apt-get install -y \
    curl \
    wget \
    git \
    build-essential \
    python3-pip \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    unzip

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
    print_status "Docker installed successfully"
else
    print_warning "Docker is already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker compose &> /dev/null; then
    sudo apt-get install -y docker-compose-plugin
    print_status "Docker Compose installed successfully"
else
    print_warning "Docker Compose is already installed"
fi

# Verify Docker installation
print_status "Verifying Docker installation..."
sudo docker --version
sudo docker compose version

# Create application directory
APP_DIR="/opt/grocery-mart"
print_status "Creating application directory at $APP_DIR..."
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR

# Navigate to application directory
cd $APP_DIR

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://mongo:27017/grocerymart
JWT_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
EOF
    print_status ".env file created"
else
    print_warning ".env file already exists, skipping..."
fi

# Check if project files exist
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found in $APP_DIR"
    print_warning "Please upload your project files to $APP_DIR"
    print_warning "You can use SCP or clone from git repository"
    exit 1
fi

# Fix permissions
print_status "Fixing file permissions..."
sudo chown -R $USER:$USER $APP_DIR

# Check if containers are already running
if sudo docker compose ps | grep -q "Up"; then
    print_warning "Containers are already running. Stopping them first..."
    sudo docker compose down
fi

# Build and start services
print_status "Building and starting Docker containers..."
sudo docker compose up -d --build

# Wait for MongoDB to be ready
print_status "Waiting for MongoDB to be ready..."
sleep 10

# Check MongoDB health
MAX_RETRIES=30
RETRY_COUNT=0
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if sudo docker exec grocery-mongo mongosh --eval "db.adminCommand('ping')" &> /dev/null; then
        print_status "MongoDB is ready!"
        break
    fi
    RETRY_COUNT=$((RETRY_COUNT + 1))
    echo -n "."
    sleep 2
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    print_error "MongoDB failed to start after $MAX_RETRIES attempts"
    exit 1
fi

# Seed database
print_status "Seeding database..."
if sudo docker exec grocery-backend npm run seed; then
    print_status "Database seeded successfully"
else
    print_warning "Database seeding failed or already seeded"
fi

# Display container status
print_status "Container status:"
sudo docker compose ps

# Get public IP
PUBLIC_IP=$(curl -s http://checkip.amazonaws.com)

echo ""
echo "=============================================="
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo "=============================================="
echo ""
echo "🌐 Access your application:"
echo "   Frontend:    http://$PUBLIC_IP"
echo "   Backend API: http://$PUBLIC_IP/api/products"
echo "   Mongo Express: http://$PUBLIC_IP:8081"
echo ""
echo "📝 Useful commands:"
echo "   View logs:    sudo docker compose logs -f"
echo "   Stop:         sudo docker compose down"
echo "   Restart:      sudo docker compose restart"
echo "   Status:       sudo docker compose ps"
echo ""
print_warning "Note: Make sure your EC2 security group allows traffic on ports 80, 3000, and 8081"
echo ""

