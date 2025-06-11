# IAM Configuration for SceneHunter V2
# Following principle of least privilege

# Custom IAM Role for SceneHunter Backend Service
resource "google_project_iam_custom_role" "scenehunter_backend" {
  role_id     = "scenehunterBackend"
  title       = "SceneHunter Backend Service"
  description = "Custom role for SceneHunter backend service with minimal required permissions"
  project     = var.project_id

  permissions = [
    # Firestore permissions
    "datastore.databases.get",
    "datastore.entities.create",
    "datastore.entities.delete",
    "datastore.entities.get",
    "datastore.entities.list",
    "datastore.entities.update",
    
    # Firebase Auth permissions
    "firebase.users.get",
    "firebase.users.create",
    "firebase.users.update",
    
    # Storage permissions
    "storage.objects.create",
    "storage.objects.delete",
    "storage.objects.get",
    "storage.objects.list",
    
    # Monitoring and logging
    "monitoring.metricDescriptors.list",
    "monitoring.timeSeries.create",
    "logging.logEntries.create",
    
    # AI Platform permissions (for Vertex AI)
    "aiplatform.endpoints.predict",
    "aiplatform.models.predict",
  ]
}

# Service Account for Backend API
resource "google_service_account" "backend_api" {
  account_id   = "${local.name_prefix}-backend-api"
  display_name = "SceneHunter Backend API Service Account"
  description  = "Service account for SceneHunter backend API"
  project      = var.project_id
}

# Service Account for Frontend (Firebase App)
resource "google_service_account" "frontend_app" {
  account_id   = "${local.name_prefix}-frontend-app"
  display_name = "SceneHunter Frontend App Service Account"
  description  = "Service account for SceneHunter frontend application"
  project      = var.project_id
}

# Service Account for Terraform
resource "google_service_account" "terraform" {
  account_id   = "${local.name_prefix}-terraform"
  display_name = "SceneHunter Terraform Service Account"
  description  = "Service account for Terraform infrastructure management"
  project      = var.project_id
}

# Bind custom role to backend service account
resource "google_project_iam_member" "backend_api_custom_role" {
  project = var.project_id
  role    = google_project_iam_custom_role.scenehunter_backend.name
  member  = "serviceAccount:${google_service_account.backend_api.email}"
}

# Additional roles for backend service account
resource "google_project_iam_member" "backend_api_roles" {
  for_each = toset([
    "roles/firebase.admin",
    "roles/storage.objectAdmin",
    "roles/aiplatform.user",
    "roles/monitoring.metricWriter",
    "roles/logging.logWriter"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.backend_api.email}"
}

# Frontend app roles (minimal permissions)
resource "google_project_iam_member" "frontend_app_roles" {
  for_each = toset([
    "roles/firebase.viewer",
    "roles/storage.objectViewer"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.frontend_app.email}"
}

# Terraform service account roles
resource "google_project_iam_member" "terraform_roles" {
  for_each = toset([
    "roles/editor",
    "roles/iam.serviceAccountAdmin",
    "roles/resourcemanager.projectIamAdmin",
    "roles/storage.admin"
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.terraform.email}"
}

# Developer group permissions (if groups exist)
resource "google_project_iam_member" "developers" {
  for_each = var.developers_group != "" ? toset([
    "roles/viewer",
    "roles/firebase.developAdmin",
    "roles/storage.objectAdmin",
    "roles/cloudsql.client",
    "roles/run.developer"
  ]) : toset([])

  project = var.project_id
  role    = each.value
  member  = "group:${var.developers_group}"
}

# Admin group permissions (if groups exist)
resource "google_project_iam_member" "admins" {
  for_each = var.admins_group != "" ? toset([
    "roles/owner",
    "roles/billing.admin",
    "roles/resourcemanager.projectIamAdmin"
  ]) : toset([])

  project = var.project_id
  role    = each.value
  member  = "group:${var.admins_group}"
}

# Service Account Keys for Backend API (for local development)
resource "google_service_account_key" "backend_api_key" {
  service_account_id = google_service_account.backend_api.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

# Store service account key in Secret Manager
resource "google_secret_manager_secret" "backend_api_key" {
  secret_id = "${local.name_prefix}-backend-api-key"
  project   = var.project_id

  replication {
    auto {}
  }

  depends_on = [google_project_service.secretmanager_api]
}

resource "google_secret_manager_secret_version" "backend_api_key" {
  secret      = google_secret_manager_secret.backend_api_key.id
  secret_data = base64decode(google_service_account_key.backend_api_key.private_key)
}

# IAM binding for secret access
resource "google_secret_manager_secret_iam_member" "backend_api_key_access" {
  project   = var.project_id
  secret_id = google_secret_manager_secret.backend_api_key.secret_id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_service_account.backend_api.email}"
}
