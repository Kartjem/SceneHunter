# Variables for SceneHunter V2 Terraform Configuration

variable "project_id" {
  description = "The GCP project ID"
  type        = string
  default     = "scenehunter-29ff8"
}

variable "project_name" {
  description = "The project name for resource naming"
  type        = string
  default     = "scenehunter"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "region" {
  description = "The GCP region"
  type        = string
  default     = "europe-west1"
}

variable "zone" {
  description = "The GCP zone"
  type        = string
  default     = "europe-west1-b"
}

variable "billing_account" {
  description = "The billing account ID for the project"
  type        = string
  default     = ""
  sensitive   = true
}

# Network Configuration
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_cidr" {
  description = "CIDR block for the private subnet"
  type        = string
  default     = "10.0.2.0/24"
}

variable "db_subnet_cidr" {
  description = "CIDR block for the database subnet"
  type        = string
  default     = "10.0.3.0/24"
}

# Firebase Configuration
variable "firebase_project_id" {
  description = "Firebase project ID (same as GCP project ID)"
  type        = string
  default     = "scenehunter-29ff8"
}

# API Keys and External Services
variable "allowed_cors_origins" {
  description = "List of allowed CORS origins"
  type        = list(string)
  default = [
    "http://localhost:3000",
    "https://scenehunter-29ff8.web.app",
    "https://scenehunter-29ff8.firebaseapp.com"
  ]
}

# IAM Configuration
variable "developers_group" {
  description = "Google Group for developers"
  type        = string
  default     = "scenehunter-developers@kartjem.com"
}

variable "admins_group" {
  description = "Google Group for administrators"
  type        = string
  default     = "scenehunter-admins@kartjem.com"
}
