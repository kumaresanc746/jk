# 🚀 Quick Start Guide

## Local Development (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB (using Docker)
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# 3. Seed database with products
npm run seed

# 4. Start server
npm start

# 5. Open browser
# http://localhost:3000
```

## Docker Compose (3 minutes)

```bash
# 1. Start all services
docker-compose up -d

# 2. Seed database
docker exec -it grocery-backend npm run seed

# 3. Access application
# Frontend: http://localhost
# Mongo Express: http://localhost:8081 (admin/admin123)
```

## Default Login Credentials

**Admin:**
- Email: admin@grocerymart.com
- Password: admin123

**User:** Create account via Signup page

## Test the Application

1. **Browse Products**: http://localhost:3000/products.html
2. **Login as Admin**: http://localhost:3000/admin-login.html
3. **View Dashboard**: http://localhost:3000/admin.html

## Next Steps

- See [README.md](README.md) for full documentation
- Check [terraform/README.md](terraform/README.md) for AWS setup
- Check [kubernetes/README.md](kubernetes/README.md) for K8s deployment
- Check [ansible/README.md](ansible/README.md) for server configuration

