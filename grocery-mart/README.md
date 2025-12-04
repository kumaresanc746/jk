# 🛒 GroceryMart - Full-Stack E-Commerce Platform

A complete, production-ready full-stack grocery e-commerce application with modern UI, backend APIs, Docker containerization, CI/CD pipeline, cloud infrastructure, and monitoring.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- [AWS Infrastructure (Terraform)](#aws-infrastructure-terraform)
- [Configuration Management (Ansible)](#configuration-management-ansible)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline (Jenkins)](#cicd-pipeline-jenkins)
- [Monitoring (Prometheus & Grafana)](#monitoring-prometheus--grafana)
- [API Documentation](#api-documentation)
- [Default Credentials](#default-credentials)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Frontend
- 🏠 **Home Page** - Hero banners and grocery categories
- 🔐 **User Authentication** - Login and Signup pages
- 👤 **Admin Login** - Separate admin access
- 📦 **Product Listing** - Browse products by category
- 🔍 **Product Search** - Search functionality
- 📄 **Product Details** - Detailed product information
- 🛒 **Shopping Cart** - Add, update, remove items
- 💳 **Checkout** - Complete order workflow
- 👤 **User Profile** - Order history and settings
- 📊 **Admin Dashboard** - Complete admin panel with:
  - Dashboard statistics
  - Product CRUD operations
  - User management
  - Order management
  - Delivery status tracking
- 📱 **Responsive Design** - Mobile-first UI like Zepto/Blinkit

### Backend
- 🔒 **JWT Authentication** - Secure token-based auth
- 👥 **Role-based Access** - User and Admin roles
- 🛍️ **Product Management** - Full CRUD operations
- 🛒 **Cart Management** - Add, update, remove items
- 📦 **Order Management** - Order creation and tracking
- 🔐 **Admin APIs** - Protected admin endpoints
- ✅ **Error Handling** - Comprehensive error handling
- 📊 **MongoDB Integration** - Mongoose schemas with relationships

## 🛠️ Tech Stack

### Frontend
- Pure HTML, CSS, JavaScript (No frameworks)
- Responsive Mobile-First Design

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

### DevOps & Infrastructure
- Docker & Docker Compose
- Kubernetes
- Terraform (AWS)
- Ansible
- Jenkins CI/CD
- Prometheus & Grafana

## 📁 Project Structure

```
grocery-mart/
├── frontend/              # Frontend files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   ├── index.html        # Home page
│   ├── login.html        # User login
│   ├── signup.html       # User signup
│   ├── admin-login.html  # Admin login
│   ├── products.html     # Product listing
│   ├── product-detail.html
│   ├── cart.html         # Shopping cart
│   ├── checkout.html     # Checkout
│   ├── profile.html      # User profile
│   └── admin.html        # Admin dashboard
├── backend/              # Backend files
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Middleware (auth)
│   └── scripts/         # Seed script
├── terraform/           # AWS infrastructure
├── ansible/             # Configuration management
├── kubernetes/          # K8s deployments
├── monitoring/          # Prometheus & Grafana
├── docker-compose.yml   # Docker Compose config
├── Dockerfile.backend   # Backend Dockerfile
├── Dockerfile.frontend  # Frontend Dockerfile
├── Jenkinsfile          # CI/CD pipeline
├── server.js            # Express server
└── package.json         # Node.js dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- MongoDB (v5+)
- Docker & Docker Compose (optional)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grocery-mart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # Using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:7.0
   
   # Or use local MongoDB installation
   mongod
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Start the server**
   ```bash
   npm start
   # Or for development with auto-reload
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

1. **Build and start all services**
   ```bash
   docker-compose up -d
   ```

2. **Seed the database**
   ```bash
   docker exec -it grocery-backend npm run seed
   ```

3. **Access services**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - MongoDB: localhost:27017
   - Mongo Express: http://localhost:8081 (admin/admin123)

### Manual Docker Build

1. **Build backend image**
   ```bash
   docker build -f Dockerfile.backend -t grocery-mart-backend .
   ```

2. **Build frontend image**
   ```bash
   docker build -f Dockerfile.frontend -t grocery-mart-frontend .
   ```

3. **Run containers**
   ```bash
   docker run -d -p 3000:3000 --name backend grocery-mart-backend
   docker run -d -p 80:80 --name frontend grocery-mart-frontend
   ```

## ☁️ AWS Infrastructure (Terraform)

### Prerequisites

- AWS Account with appropriate permissions
- Terraform installed (>= 1.0)
- AWS CLI configured
- SSH key pair created in AWS

### Setup Steps

1. **Navigate to Terraform directory**
   ```bash
   cd terraform
   ```

2. **Create S3 bucket for Terraform state**
   ```bash
   aws s3 mb s3://grocery-mart-terraform-state
   ```

3. **Create SSH key pair**
   ```bash
   aws ec2 create-key-pair --key-name grocery-mart-key --query 'KeyMaterial' --output text > grocery-mart-key.pem
   chmod 400 grocery-mart-key.pem
   ```

4. **Update variables** (if needed)
   Edit `variables.tf` to customize:
   - AWS region
   - Instance types
   - VPC CIDR blocks

5. **Initialize Terraform**
   ```bash
   terraform init
   ```

6. **Plan infrastructure**
   ```bash
   terraform plan
   ```

7. **Apply infrastructure**
   ```bash
   terraform apply
   ```

8. **Get outputs**
   ```bash
   terraform output ec2_public_ip
   terraform output eks_cluster_endpoint
   ```

### What Gets Created

- ✅ VPC with public and private subnets
- ✅ Internet Gateway and NAT Gateways
- ✅ Security Groups
- ✅ EC2 Instance (Ubuntu for Jenkins)
- ✅ EKS Cluster with Auto-Scaling Node Group
- ✅ Application Load Balancer
- ✅ IAM Roles and Policies

### Destroy Infrastructure

```bash
terraform destroy
```

## ⚙️ Configuration Management (Ansible)

### Prerequisites

- Ansible installed
- SSH access to target servers
- Updated inventory file

### Setup Steps

1. **Navigate to Ansible directory**
   ```bash
   cd ansible
   ```

2. **Update inventory.ini**
   ```ini
   jenkins_server ansible_host=<EC2_PUBLIC_IP> ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/grocery-mart-key.pem
   ```

3. **Test connectivity**
   ```bash
   ansible all -i inventory.ini -m ping
   ```

4. **Run the playbook**
   ```bash
   ansible-playbook -i inventory.ini playbook.yml
   ```

### What Gets Installed

- ✅ Docker & Docker Compose
- ✅ Jenkins CI/CD Server
- ✅ kubectl
- ✅ Application deployment

### Access Jenkins

After Ansible completes:
```bash
# Get Jenkins initial password
ssh ubuntu@<EC2_IP>
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# Access Jenkins UI
http://<EC2_IP>:8080
```

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (EKS, GKE, or local)
- kubectl configured
- NGINX Ingress Controller installed
- Docker images in container registry

### Setup Steps

1. **Update image references**
   Edit deployment files to replace `your-registry.com` with your registry URL

2. **Create namespace**
   ```bash
   kubectl apply -f kubernetes/namespace.yaml
   ```

3. **Create secrets**
   ```bash
   kubectl apply -f kubernetes/secrets.yaml
   ```

4. **Create configmap**
   ```bash
   kubectl apply -f kubernetes/configmap.yaml
   ```

5. **Deploy MongoDB**
   ```bash
   kubectl apply -f kubernetes/mongo-statefulset.yaml
   ```

6. **Deploy backend**
   ```bash
   kubectl apply -f kubernetes/backend-deployment.yaml
   ```

7. **Deploy frontend**
   ```bash
   kubectl apply -f kubernetes/frontend-deployment.yaml
   ```

8. **Deploy Mongo Express**
   ```bash
   kubectl apply -f kubernetes/mongo-express.yaml
   ```

9. **Deploy Ingress**
   ```bash
   kubectl apply -f kubernetes/ingress.yaml
   ```

10. **Or apply all at once**
    ```bash
    kubectl apply -f kubernetes/
    ```

### Verify Deployment

```bash
# Check all resources
kubectl get all -n grocery-mart

# Check pod status
kubectl get pods -n grocery-mart

# View logs
kubectl logs -f deployment/backend-deployment -n grocery-mart
kubectl logs -f deployment/frontend-deployment -n grocery-mart

# Scale deployments
kubectl scale deployment backend-deployment --replicas=3 -n grocery-mart
```

### Access Services

- **Frontend**: Via LoadBalancer service or Ingress
- **Backend API**: Via Ingress at `/api`
- **Mongo Express**: Via NodePort at `http://<node-ip>:30081`

## 🔄 CI/CD Pipeline (Jenkins)

### Jenkins Setup

1. **Access Jenkins**
   ```bash
   http://<EC2_IP>:8080
   ```

2. **Install required plugins**
   - Docker Pipeline
   - Kubernetes CLI
   - Git
   - GitHub (if using GitHub)

3. **Configure credentials**
   - Docker registry credentials
   - Kubernetes kubeconfig
   - Git credentials (if private repo)

4. **Create Jenkins pipeline**
   - New Item → Pipeline
   - Pipeline script from SCM
   - Point to your repository

### Jenkinsfile Stages

1. **Git Pull** - Pull latest code
2. **Install Dependencies** - npm install
3. **Build Frontend** - Prepare frontend assets
4. **Docker Build** - Build Docker images
5. **Docker Push** - Push to registry
6. **Deploy to Kubernetes** - Update deployments

### Manual Pipeline Trigger

```bash
# Via Jenkins UI or
curl -X POST http://<jenkins-url>/job/grocery-mart/build
```

## 📊 Monitoring (Prometheus & Grafana)

### Deploy Prometheus

```bash
kubectl apply -f monitoring/prometheus-deployment.yaml
```

### Deploy Grafana

```bash
kubectl apply -f monitoring/grafana-deployment.yaml
```

### Access Monitoring

1. **Port forward to access locally**
   ```bash
   # Prometheus
   kubectl port-forward -n grocery-mart svc/prometheus-service 9090:9090
   # Access: http://localhost:9090
   
   # Grafana
   kubectl port-forward -n grocery-mart svc/grafana-service 3000:3000
   # Access: http://localhost:3000
   # Login: admin / admin123
   ```

2. **Or use LoadBalancer IPs**
   ```bash
   kubectl get svc -n grocery-mart
   ```

### Import Grafana Dashboards

1. Login to Grafana
2. Go to Dashboards → Import
3. Use these dashboard IDs:
   - Kubernetes Cluster Monitoring: 6417
   - Node Exporter Full: 1860
   - Kubernetes Deployment: 8588

## 📡 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890"
}
```

**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**GET** `/api/auth/me` (Requires authentication)

### Product Endpoints

**GET** `/api/products` - Get all products
- Query params: `category`, `search`, `page`, `limit`

**GET** `/api/products/:id` - Get single product

### Cart Endpoints (Requires authentication)

**GET** `/api/cart` - Get user cart

**POST** `/api/cart/add`
```json
{
  "productId": "product_id",
  "quantity": 1
}
```

**POST** `/api/cart/remove`
```json
{
  "productId": "product_id"
}
```

**PUT** `/api/cart/update`
```json
{
  "productId": "product_id",
  "quantity": 2
}
```

### Order Endpoints (Requires authentication)

**POST** `/api/order/create`
```json
{
  "deliveryAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "paymentMethod": "COD"
}
```

**GET** `/api/order/history` - Get user order history

**GET** `/api/order/:id` - Get single order

### Admin Endpoints (Requires admin role)

**GET** `/api/admin/dashboard` - Get dashboard stats

**GET** `/api/admin/products` - Get all products

**POST** `/api/admin/products/add` - Add product

**PUT** `/api/admin/products/update/:id` - Update product

**DELETE** `/api/admin/products/delete/:id` - Delete product

**GET** `/api/admin/users` - Get all users

**GET** `/api/admin/orders` - Get all orders

**PUT** `/api/admin/orders/:id/status` - Update order status

## 🔑 Default Credentials

### Admin Account
- **Email**: admin@grocerymart.com
- **Password**: admin123

*Note: This account is created automatically when you seed the database.*

### Mongo Express
- **Username**: admin
- **Password**: admin123

### Grafana
- **Username**: admin
- **Password**: admin123

## 🐛 Troubleshooting

### MongoDB Connection Issues

```bash
# Check MongoDB is running
docker ps | grep mongo
# or
systemctl status mongod

# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/grocerymart
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Docker Build Fails

```bash
# Check Docker daemon is running
docker info

# Rebuild without cache
docker build --no-cache -f Dockerfile.backend -t grocery-mart-backend .
```

### Kubernetes Pods Not Starting

```bash
# Check pod status
kubectl describe pod <pod-name> -n grocery-mart

# Check logs
kubectl logs <pod-name> -n grocery-mart

# Check events
kubectl get events -n grocery-mart
```

### Jenkins Pipeline Fails

```bash
# Check Jenkins logs
sudo tail -f /var/log/jenkins/jenkins.log

# Check build logs in Jenkins UI
# Build History → Console Output
```

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/grocerymart
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

## 🗄️ Database Schema

### Collections

- **users** - User accounts (email, password, role)
- **products** - Product catalog
- **carts** - Shopping carts (linked to users)
- **orders** - Order history

### Seed Data

The seed script creates:
- 25+ grocery products across 9 categories
- Default admin user

Run seed: `npm run seed`

## 🚢 Production Deployment Workflow

1. **Provision Infrastructure**
   ```bash
   cd terraform
   terraform apply
   ```

2. **Configure Servers**
   ```bash
   cd ansible
   ansible-playbook -i inventory.ini playbook.yml
   ```

3. **Deploy to Kubernetes**
   ```bash
   kubectl apply -f kubernetes/
   ```

4. **Setup Monitoring**
   ```bash
   kubectl apply -f monitoring/
   ```

5. **Configure CI/CD**
   - Setup Jenkins pipeline
   - Configure webhooks
   - Test deployment

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🎉 Acknowledgments

- Design inspired by Zepto and Blinkit
- Built with modern DevOps practices
- Production-ready infrastructure

---

**Made with ❤️ for grocery shopping**

