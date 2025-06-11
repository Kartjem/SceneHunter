# Network Configuration for SceneHunter V2

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "${local.name_prefix}-vpc"
  auto_create_subnetworks = false
  mtu                     = 1460
  project                 = var.project_id

  depends_on = [google_project_service.compute_api]
}

# Public Subnet (for Load Balancers, NAT Gateway)
resource "google_compute_subnetwork" "public" {
  name          = "${local.name_prefix}-public-subnet"
  ip_cidr_range = var.public_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  # Enable private Google access for instances without external IPs
  private_ip_google_access = true

  # Secondary ranges for GKE (if needed in future)
  secondary_ip_range {
    range_name    = "pods"
    ip_cidr_range = "10.1.0.0/16"
  }

  secondary_ip_range {
    range_name    = "services"
    ip_cidr_range = "10.2.0.0/16"
  }

  log_config {
    aggregation_interval = "INTERVAL_10_MIN"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# Private Subnet (for Backend Services, Compute Instances)
resource "google_compute_subnetwork" "private" {
  name          = "${local.name_prefix}-private-subnet"
  ip_cidr_range = var.private_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  private_ip_google_access = true

  log_config {
    aggregation_interval = "INTERVAL_10_MIN"
    flow_sampling        = 0.5
    metadata             = "INCLUDE_ALL_METADATA"
  }
}

# Database Subnet (for Cloud SQL Private IP)
resource "google_compute_subnetwork" "database" {
  name          = "${local.name_prefix}-db-subnet"
  ip_cidr_range = var.db_subnet_cidr
  region        = var.region
  network       = google_compute_network.vpc.id
  project       = var.project_id

  private_ip_google_access = true
}

# Cloud Router for NAT Gateway
resource "google_compute_router" "router" {
  name    = "${local.name_prefix}-router"
  region  = var.region
  network = google_compute_network.vpc.id
  project = var.project_id
}

# NAT Gateway for outbound internet access from private subnets
resource "google_compute_router_nat" "nat" {
  name                               = "${local.name_prefix}-nat"
  router                             = google_compute_router.router.name
  region                             = var.region
  project                            = var.project_id
  nat_ip_allocate_option             = "AUTO_ONLY"
  source_subnetwork_ip_ranges_to_nat = "ALL_SUBNETWORKS_ALL_IP_RANGES"

  log_config {
    enable = true
    filter = "ERRORS_ONLY"
  }
}

# Global VPC Peering for Google Services (Cloud SQL, etc.)
resource "google_compute_global_address" "private_ip_address" {
  name          = "${local.name_prefix}-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
  project       = var.project_id

  depends_on = [google_project_service.servicenetworking_api]
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]

  depends_on = [google_project_service.servicenetworking_api]
}
