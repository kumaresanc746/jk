# Kubernetes Deployment for GroceryMart

This directory contains Kubernetes YAML manifests for deploying the GroceryMart application.

## Prerequisites

1. Kubernetes cluster (EKS, GKE, or local)
2. kubectl configured to access your cluster
3. NGINX Ingress Controller installed
4. Docker images pushed to your container registry

## Setup

1. Update image references in deployment files:
   - Replace `your-registry.com` with your container registry URL
   - Update image tags as needed

2. Create secrets:
   ```bash
   kubectl apply -f secrets.yaml
   ```

3. Apply all resources:
   ```bash
   kubectl apply -f namespace.yaml
   kubectl apply -f configmap.yaml
   kubectl apply -f secrets.yaml
   kubectl apply -f mongo-statefulset.yaml
   kubectl apply -f backend-deployment.yaml
   kubectl apply -f frontend-deployment.yaml
   kubectl apply -f mongo-express.yaml
   kubectl apply -f ingress.yaml
   ```

   Or apply all at once:
   ```bash
   kubectl apply -f .
   ```

## Verify Deployment

```bash
# Check all resources
kubectl get all -n grocery-mart

# Check pods status
kubectl get pods -n grocery-mart

# Check services
kubectl get svc -n grocery-mart

# Check ingress
kubectl get ingress -n grocery-mart

# View logs
kubectl logs -f deployment/backend-deployment -n grocery-mart
kubectl logs -f deployment/frontend-deployment -n grocery-mart
```

## Access Services

- **Frontend**: Via LoadBalancer service or Ingress
- **Backend API**: Via Ingress at `/api`
- **Mongo Express**: Via NodePort at `http://<node-ip>:30081`

## Scaling

```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=3 -n grocery-mart

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=3 -n grocery-mart
```

## Updates

```bash
# Update image
kubectl set image deployment/backend-deployment backend=your-registry.com/grocery-mart-backend:v2 -n grocery-mart

# Rolling update
kubectl rollout status deployment/backend-deployment -n grocery-mart
```

## Cleanup

```bash
kubectl delete namespace grocery-mart
```

