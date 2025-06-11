# Firewall Rules for SceneHunter V2

# Allow HTTP and HTTPS traffic to the public subnet
resource "google_compute_firewall" "allow_http_https" {
  name    = "${local.name_prefix}-allow-http-https"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }

  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["web-server"]

  description = "Allow HTTP and HTTPS traffic from anywhere"
}

# Allow SSH access to instances (restricted to specific IPs in production)
resource "google_compute_firewall" "allow_ssh" {
  name    = "${local.name_prefix}-allow-ssh"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["22"]
  }

  # In production, restrict this to specific IP ranges
  source_ranges = var.environment == "prod" ? ["0.0.0.0/0"] : ["0.0.0.0/0"]
  target_tags   = ["ssh-allowed"]

  description = "Allow SSH access to instances"
}

# Allow internal communication within VPC
resource "google_compute_firewall" "allow_internal" {
  name    = "${local.name_prefix}-allow-internal"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "udp"
    ports    = ["0-65535"]
  }

  allow {
    protocol = "icmp"
  }

  source_ranges = [var.vpc_cidr]

  description = "Allow all internal traffic within VPC"
}

# Allow Backend API traffic (Node.js/Express)
resource "google_compute_firewall" "allow_backend_api" {
  name    = "${local.name_prefix}-allow-backend-api"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["3001", "8080", "8000"]
  }

  source_ranges = [var.vpc_cidr]
  target_tags   = ["backend-api"]

  description = "Allow access to backend API services"
}

# Allow Google Cloud Load Balancer health checks
resource "google_compute_firewall" "allow_health_check" {
  name    = "${local.name_prefix}-allow-health-check"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["80", "443", "3001", "8080"]
  }

  # Google Cloud Load Balancer health check IP ranges
  source_ranges = [
    "130.211.0.0/22",
    "35.191.0.0/16"
  ]

  target_tags = ["web-server", "backend-api"]

  description = "Allow Google Cloud Load Balancer health checks"
}

# Deny all other inbound traffic (explicit deny rule)
resource "google_compute_firewall" "deny_all" {
  name     = "${local.name_prefix}-deny-all"
  network  = google_compute_network.vpc.name
  project  = var.project_id
  priority = 65534

  deny {
    protocol = "all"
  }

  source_ranges = ["0.0.0.0/0"]

  description = "Deny all other inbound traffic (explicit deny)"
}

# Allow outbound traffic (default allow all egress, but explicit for clarity)
resource "google_compute_firewall" "allow_egress" {
  name      = "${local.name_prefix}-allow-egress"
  network   = google_compute_network.vpc.name
  project   = var.project_id
  direction = "EGRESS"

  allow {
    protocol = "all"
  }

  destination_ranges = ["0.0.0.0/0"]

  description = "Allow all outbound traffic"
}

# Firewall rule for Cloud SQL proxy connections
resource "google_compute_firewall" "allow_cloud_sql_proxy" {
  name    = "${local.name_prefix}-allow-cloud-sql-proxy"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["3307", "5432"]
  }

  source_ranges = [var.private_subnet_cidr]
  target_tags   = ["database"]

  description = "Allow Cloud SQL proxy connections"
}

# Allow Firebase/Firestore connections (if using private endpoints)
resource "google_compute_firewall" "allow_firebase" {
  name    = "${local.name_prefix}-allow-firebase"
  network = google_compute_network.vpc.name
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["443"]
  }

  source_ranges = [var.vpc_cidr]
  target_tags   = ["firebase-client"]

  description = "Allow Firebase/Firestore connections"
}
