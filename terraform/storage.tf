# Storage and Bucket Configuration for SceneHunter V2

# Terraform state bucket
resource "google_storage_bucket" "terraform_state" {
  name     = "${var.project_id}-terraform-state"
  location = var.region
  project  = var.project_id

  # Prevent accidental deletion
  lifecycle {
    prevent_destroy = true
  }

  # Enable versioning for state file history
  versioning {
    enabled = true
  }

  # Encrypt with Google-managed keys
  encryption {
    default_kms_key_name = ""
  }

  # Public access prevention
  public_access_prevention = "enforced"

  # Uniform bucket-level access
  uniform_bucket_level_access = true

  labels = merge(local.common_labels, {
    purpose = "terraform-state"
  })
}

# Application storage bucket for user uploads
resource "google_storage_bucket" "app_storage" {
  name     = "${var.project_id}-app-storage"
  location = var.region
  project  = var.project_id

  # CORS configuration for web app access
  cors {
    origin          = var.allowed_cors_origins
    method          = ["GET", "HEAD", "PUT", "POST", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  # Lifecycle rule to delete old uploads
  lifecycle_rule {
    condition {
      age = 365 # Delete files older than 1 year
    }
    action {
      type = "Delete"
    }
  }

  # Lifecycle rule to move to nearline storage after 30 days
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  # Public access prevention
  public_access_prevention = "enforced"

  # Uniform bucket-level access
  uniform_bucket_level_access = true

  labels = merge(local.common_labels, {
    purpose = "app-storage"
  })
}

# Static assets bucket for CDN
resource "google_storage_bucket" "static_assets" {
  name     = "${var.project_id}-static-assets"
  location = var.region
  project  = var.project_id

  # Make this bucket publicly readable for CDN
  uniform_bucket_level_access = true

  # Website configuration
  website {
    main_page_suffix = "index.html"
    not_found_page   = "404.html"
  }

  # CORS configuration
  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  labels = merge(local.common_labels, {
    purpose = "static-assets"
  })
}

# Make static assets bucket publicly readable
resource "google_storage_bucket_iam_member" "static_assets_public" {
  bucket = google_storage_bucket.static_assets.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Backup bucket for database backups
resource "google_storage_bucket" "backups" {
  name     = "${var.project_id}-backups"
  location = var.region
  project  = var.project_id

  # Lifecycle rule for backup retention
  lifecycle_rule {
    condition {
      age = 90 # Keep backups for 90 days
    }
    action {
      type = "Delete"
    }
  }

  # Move to coldline storage after 7 days
  lifecycle_rule {
    condition {
      age = 7
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  # Enable versioning for backup safety
  versioning {
    enabled = true
  }

  # Public access prevention
  public_access_prevention = "enforced"

  # Uniform bucket-level access
  uniform_bucket_level_access = true

  labels = merge(local.common_labels, {
    purpose = "backups"
  })
}

# Logs bucket for application logs
resource "google_storage_bucket" "logs" {
  name     = "${var.project_id}-logs"
  location = var.region
  project  = var.project_id

  # Lifecycle rule for log retention
  lifecycle_rule {
    condition {
      age = 30 # Keep logs for 30 days
    }
    action {
      type = "Delete"
    }
  }

  # Move to coldline storage after 1 day
  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type          = "SetStorageClass"
      storage_class = "COLDLINE"
    }
  }

  # Public access prevention
  public_access_prevention = "enforced"

  # Uniform bucket-level access
  uniform_bucket_level_access = true

  labels = merge(local.common_labels, {
    purpose = "logs"
  })
}
