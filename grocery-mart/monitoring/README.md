# Monitoring Setup for GroceryMart

This directory contains Prometheus and Grafana deployment configurations for monitoring the GroceryMart application.

## Prerequisites

1. Kubernetes cluster with monitoring namespace or use existing namespace
2. kubectl configured
3. (Optional) Prometheus Operator installed for ServiceMonitor

## Deployment

### Prometheus

```bash
# Deploy Prometheus
kubectl apply -f prometheus-deployment.yaml

# Check Prometheus deployment
kubectl get pods -n grocery-mart -l app=prometheus

# Access Prometheus UI
kubectl port-forward -n grocery-mart svc/prometheus-service 9090:9090
# Open http://localhost:9090
```

### Grafana

```bash
# Deploy Grafana
kubectl apply -f grafana-deployment.yaml

# Check Grafana deployment
kubectl get pods -n grocery-mart -l app=grafana

# Access Grafana UI
kubectl port-forward -n grocery-mart svc/grafana-service 3000:3000
# Open http://localhost:3000
# Default credentials: admin / admin123
```

### ServiceMonitor (if using Prometheus Operator)

```bash
kubectl apply -f servicemonitor.yaml
```

## Grafana Dashboards

### Import Dashboards

1. Login to Grafana (admin/admin123)
2. Go to Dashboards → Import
3. Use dashboard IDs from Grafana.com:
   - Kubernetes Cluster Monitoring: 6417
   - Node Exporter Full: 1860
   - Kubernetes Deployment Statefulset Daemonset metrics: 8588

### Create Custom Dashboard

1. Go to Dashboards → New Dashboard
2. Add panels for:
   - API Request Rate
   - API Response Time
   - Error Rate
   - Pod CPU/Memory Usage
   - Database Connection Pool
   - Order Processing Metrics

## Metrics to Monitor

### Application Metrics
- HTTP request rate
- HTTP response times
- Error rates (4xx, 5xx)
- Active users/sessions
- Cart abandonment rate
- Order completion rate

### Infrastructure Metrics
- Pod CPU/Memory usage
- Container restarts
- Database connections
- Network I/O
- Disk I/O

### Business Metrics
- Orders per hour/day
- Revenue metrics
- Product views
- Search queries
- Checkout conversions

## Alerting Rules

Create Prometheus alerting rules in `prometheus-config` ConfigMap:

```yaml
groups:
  - name: grocery_mart_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
      
      - alert: HighCPUUsage
        expr: container_cpu_usage_seconds_total > 0.8
        for: 5m
        annotations:
          summary: "High CPU usage detected"
```

## Access via LoadBalancer

If using LoadBalancer services, get external IPs:

```bash
kubectl get svc -n grocery-mart prometheus-service grafana-service
```

Access:
- Prometheus: http://<prometheus-external-ip>:9090
- Grafana: http://<grafana-external-ip>:3000

## Troubleshooting

```bash
# Check Prometheus logs
kubectl logs -n grocery-mart deployment/prometheus

# Check Grafana logs
kubectl logs -n grocery-mart deployment/grafana

# Verify targets in Prometheus
# Go to Status → Targets in Prometheus UI
```

## Persistent Storage

For production, update deployments to use PersistentVolumeClaims:

```yaml
volumeMounts:
- name: prometheus-storage
  mountPath: /prometheus
volumes:
- name: prometheus-storage
  persistentVolumeClaim:
    claimName: prometheus-pvc
```

