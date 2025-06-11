# Google Cloud APIs that need to be enabled for SceneHunter V2

# Core APIs
resource "google_project_service" "compute_api" {
  project = var.project_id
  service = "compute.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "iam_api" {
  project = var.project_id
  service = "iam.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "cloudresourcemanager_api" {
  project = var.project_id
  service = "cloudresourcemanager.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Networking APIs
resource "google_project_service" "servicenetworking_api" {
  project = var.project_id
  service = "servicenetworking.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Firebase and Authentication
resource "google_project_service" "firebase_api" {
  project = var.project_id
  service = "firebase.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "firestore_api" {
  project = var.project_id
  service = "firestore.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "identitytoolkit_api" {
  project = var.project_id
  service = "identitytoolkit.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Maps and Places APIs
resource "google_project_service" "maps_backend_api" {
  project = var.project_id
  service = "maps-backend.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "geocoding_api" {
  project = var.project_id
  service = "geocoding-backend.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "places_api" {
  project = var.project_id
  service = "places-backend.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "static_maps_api" {
  project = var.project_id
  service = "static-maps-backend.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# AI and Machine Learning
resource "google_project_service" "aiplatform_api" {
  project = var.project_id
  service = "aiplatform.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "ml_api" {
  project = var.project_id
  service = "ml.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud Storage
resource "google_project_service" "storage_api" {
  project = var.project_id
  service = "storage.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "storage_component_api" {
  project = var.project_id
  service = "storage-component.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud Run (for potential backend deployment)
resource "google_project_service" "run_api" {
  project = var.project_id
  service = "run.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Container Registry
resource "google_project_service" "containerregistry_api" {
  project = var.project_id
  service = "containerregistry.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Artifact Registry (new container registry)
resource "google_project_service" "artifactregistry_api" {
  project = var.project_id
  service = "artifactregistry.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud SQL
resource "google_project_service" "sqladmin_api" {
  project = var.project_id
  service = "sqladmin.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Pub/Sub
resource "google_project_service" "pubsub_api" {
  project = var.project_id
  service = "pubsub.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud Build
resource "google_project_service" "cloudbuild_api" {
  project = var.project_id
  service = "cloudbuild.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud Functions
resource "google_project_service" "cloudfunctions_api" {
  project = var.project_id
  service = "cloudfunctions.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Cloud Scheduler
resource "google_project_service" "cloudscheduler_api" {
  project = var.project_id
  service = "cloudscheduler.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Monitoring and Logging
resource "google_project_service" "monitoring_api" {
  project = var.project_id
  service = "monitoring.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

resource "google_project_service" "logging_api" {
  project = var.project_id
  service = "logging.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Secret Manager
resource "google_project_service" "secretmanager_api" {
  project = var.project_id
  service = "secretmanager.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Video Intelligence API (for video analysis features)
resource "google_project_service" "videointelligence_api" {
  project = var.project_id
  service = "videointelligence.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}

# Vision API (for image analysis)
resource "google_project_service" "vision_api" {
  project = var.project_id
  service = "vision.googleapis.com"

  disable_dependent_services = false
  disable_on_destroy         = false
}
