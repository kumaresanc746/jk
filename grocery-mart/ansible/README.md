# Ansible Playbooks for GroceryMart

This directory contains Ansible playbooks for configuring and deploying the GroceryMart application.

## Prerequisites

1. Ansible installed on your local machine
2. SSH access to target servers
3. Updated `inventory.ini` with server IP addresses

## Setup

1. Update `inventory.ini` with your EC2 public IP:
   ```ini
   jenkins_server ansible_host=YOUR_EC2_PUBLIC_IP ansible_user=ubuntu ansible_ssh_private_key_file=~/.ssh/grocery-mart-key.pem
   ```

2. Install Ansible (if not already installed):
   ```bash
   pip install ansible
   ```

## Usage

```bash
# Test connectivity
ansible all -i inventory.ini -m ping

# Run the main playbook
ansible-playbook -i inventory.ini playbook.yml

# Run specific tasks
ansible-playbook -i inventory.ini playbook.yml --tags docker
ansible-playbook -i inventory.ini playbook.yml --tags jenkins
```

## What the Playbook Does

1. **Install Docker**: Sets up Docker Engine and Docker Compose
2. **Install Jenkins**: Configures Jenkins CI/CD server
3. **Install kubectl**: Installs Kubernetes CLI tool
4. **Deploy Application**: Copies application files and starts services with Docker Compose

## Tasks

- `tasks/docker.yml`: Docker installation and configuration
- `tasks/docker-compose.yml`: Docker Compose setup
- `tasks/jenkins.yml`: Jenkins installation and setup
- `tasks/kubectl.yml`: kubectl installation
- `tasks/deploy.yml`: Application deployment

## Variables

You can override variables in `group_vars/all.yml` or via command line:
```bash
ansible-playbook -i inventory.ini playbook.yml -e "docker_version=20.10"
```

