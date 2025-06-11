# SceneHunter V2 - Main Terraform Configuration
# Task 0.1: Google Cloud Platform Setup and Infrastructure as Code

terraform {
  required_version = ">= 1.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }

  # Backend configuration for state management
  # Uncomment and configure after creating the state bucket
  # backend "gcs" {
  #   bucket = "scenehunter-terraform-state"
  #   prefix = "terraform/state"
  # }
}

# Configure the Google Cloud Provider
provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

# Data source for current project
data "google_project" "project" {
  project_id = var.project_id
}

# Data source for current user
data "google_client_openid_userinfo" "me" {}

# Local values for common tags and naming
locals {
  common_labels = {
    project     = "scenehunter-v2"
    environment = var.environment
    managed_by  = "terraform"
    created_by  = split("@", data.google_client_openid_userinfo.me.email)[0]
  }
  
  name_prefix = "${var.project_name}-${var.environment}"
}
