# Terraform Infrastructure for GroceryMart

This directory contains Terraform configuration files to provision AWS infrastructure for the GroceryMart application.

## Prerequisites

1. AWS Account with appropriate permissions
2. Terraform installed (>= 1.0)
3. AWS CLI configured with credentials
4. SSH key pair created in AWS

## Setup

1. Update `variables.tf` with your preferred values
2. Create S3 bucket for Terraform state:
   ```bash
   aws s3 mb s3://grocery-mart-terraform-state
   ```
3. Create SSH key pair in AWS:
   ```bash
   aws ec2 create-key-pair --key-name grocery-mart-key --query 'KeyMaterial' --output text > grocery-mart-key.pem
   chmod 400 grocery-mart-key.pem
   ```

## Usage

```bash
# Initialize Terraform
terraform init

# Plan infrastructure
terraform plan

# Apply infrastructure
terraform apply

# Destroy infrastructure
terraform destroy
```

## Outputs

After applying, Terraform will output:
- VPC ID
- Public/Private Subnet IDs
- EC2 Public IP
- EKS Cluster ID and Endpoint
- Load Balancer DNS

## Resources Created

- VPC with public and private subnets
- Internet Gateway and NAT Gateways
- Security Groups
- EC2 Instance (Jenkins Server)
- EKS Cluster with Auto-Scaling Node Group
- Application Load Balancer
- IAM Roles and Policies

