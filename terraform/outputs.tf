# Outputs for SceneHunter V2 Terraform Configuration

# Project Information
output "project_id" {
  description = "The GCP project ID"
  value       = var.project_id
}

output "project_number" {
  description = "The GCP project number"
  value       = data.google_project.project.number
}

output "region" {
  description = "The GCP region"
  value       = var.region
}

# Network Information
output "vpc_id" {
  description = "The VPC network ID"
  value       = google_compute_network.vpc.id
}

output "vpc_name" {
  description = "The VPC network name"
  value       = google_compute_network.vpc.name
}

output "public_subnet_id" {
  description = "The public subnet ID"
  value       = google_compute_subnetwork.public.id
}

output "private_subnet_id" {
  description = "The private subnet ID"
  value       = google_compute_subnetwork.private.id
}

output "database_subnet_id" {
  description = "The database subnet ID"
  value       = google_compute_subnetwork.database.id
}

# Service Accounts
output "backend_api_service_account_email" {
  description = "Email of the backend API service account"
  value       = google_service_account.backend_api.email
}

output "frontend_app_service_account_email" {
  description = "Email of the frontend app service account"
  value       = google_service_account.frontend_app.email
}

output "terraform_service_account_email" {
  description = "Email of the Terraform service account"
  value       = google_service_account.terraform.email
}

# Storage Buckets
output "app_storage_bucket_name" {
  description = "Name of the application storage bucket"
  value       = google_storage_bucket.app_storage.name
}

output "static_assets_bucket_name" {
  description = "Name of the static assets bucket"
  value       = google_storage_bucket.static_assets.name
}

output "static_assets_bucket_url" {
  description = "Public URL of the static assets bucket"
  value       = "https://storage.googleapis.com/${google_storage_bucket.static_assets.name}"
}

output "terraform_state_bucket_name" {
  description = "Name of the Terraform state bucket"
  value       = google_storage_bucket.terraform_state.name
}

output "backups_bucket_name" {
  description = "Name of the backups bucket"
  value       = google_storage_bucket.backups.name
}

output "logs_bucket_name" {
  description = "Name of the logs bucket"
  value       = google_storage_bucket.logs.name
}

# Secret Manager
output "backend_api_key_secret_name" {
  description = "Name of the backend API key secret in Secret Manager"
  value       = google_secret_manager_secret.backend_api_key.secret_id
}

# Firebase Configuration
output "firebase_project_id" {
  description = "Firebase project ID"
  value       = var.firebase_project_id
}

# Network Configuration Details
output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = var.vpc_cidr
}

output "public_subnet_cidr" {
  description = "CIDR block of the public subnet"
  value       = var.public_subnet_cidr
}

output "private_subnet_cidr" {
  description = "CIDR block of the private subnet"
  value       = var.private_subnet_cidr
}

output "database_subnet_cidr" {
  description = "CIDR block of the database subnet"
  value       = var.db_subnet_cidr
}

# NAT Gateway
output "nat_gateway_name" {
  description = "Name of the NAT gateway"
  value       = google_compute_router_nat.nat.name
}

# Private IP Address for VPC Peering
output "private_ip_address_name" {
  description = "Name of the private IP address for VPC peering"
  value       = google_compute_global_address.private_ip_address.name
}

# Backend API Service Account Key (Base64 encoded)
output "backend_api_service_account_key" {
  description = "Base64 encoded service account key for backend API (sensitive)"
  value       = google_service_account_key.backend_api_key.private_key
  sensitive   = true
}

# Environment Configuration
output "environment" {
  description = "Environment name"
  value       = var.environment
}

# Common Labels
output "common_labels" {
  description = "Common labels applied to all resources"
  value       = local.common_labels
}

# Resource Naming Prefix
output "name_prefix" {
  description = "Common naming prefix for resources"
  value       = local.name_prefix
}
