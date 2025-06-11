
set -e 

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="scenehunter-29ff8"
REGION="europe-west1"
ZONE="europe-west1-b"

echo -e "${BLUE}🚀 SceneHunter V2 Infrastructure Deployment${NC}"
echo -e "${BLUE}==========================================${NC}"

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    print_info "Checking prerequisites..."
    
    if ! command -v gcloud &> /dev/null; then
        print_error "Google Cloud CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! command -v terraform &> /dev/null; then
        print_error "Terraform is not installed. Please install it first."
        exit 1
    fi
    
    if ! gcloud auth list --filter="status:ACTIVE" --format="value(account)" | grep -q .; then
        print_error "Not authenticated with Google Cloud. Please run: gcloud auth login"
        exit 1
    fi
    
    print_status "Prerequisites check passed"
}

setup_gcloud() {
    print_info "Setting up Google Cloud configuration..."
    
    gcloud config set project $PROJECT_ID
    gcloud config set compute/region $REGION
    gcloud config set compute/zone $ZONE
    
    if ! gcloud auth application-default print-access-token &> /dev/null; then
        print_warning "Setting up application default credentials..."
        gcloud auth application-default login
    fi
    
    print_status "Google Cloud configuration completed"
}

prepare_terraform() {
    print_info "Preparing Terraform configuration..."
    
    if [ ! -f "terraform.tfvars" ]; then
        print_warning "Creating terraform.tfvars from example..."
        cp terraform.tfvars.example terraform.tfvars
        
        CURRENT_USER=$(gcloud config get-value account 2>/dev/null || echo "")
        if [ ! -z "$CURRENT_USER" ]; then
            print_info "Using Google account: $CURRENT_USER"
        fi
    fi
    
    print_status "Terraform configuration prepared"
}

init_terraform() {
    print_info "Initializing Terraform..."
    
    terraform init -upgrade
    
    print_status "Terraform initialized"
}

plan_terraform() {
    print_info "Planning Terraform deployment..."
    
    terraform plan -out=tfplan
    
    print_status "Terraform plan created"
}

apply_terraform() {
    print_info "Applying Terraform deployment..."
    
    if [ "$1" != "--auto-approve" ]; then
        echo -e "${YELLOW}Do you want to apply the planned changes? (y/N)${NC}"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            print_warning "Deployment cancelled by user"
            exit 0
        fi
    fi
    
    terraform apply tfplan
    
    print_status "Terraform deployment completed"
}

setup_backend_credentials() {
    print_info "Setting up backend API credentials..."
    
    terraform output -raw backend_api_service_account_key | base64 -d > ../backend/serviceAccountKey.json
    
    if [ -f "../backend/.env" ]; then
        if grep -q "GOOGLE_APPLICATION_CREDENTIALS" ../backend/.env; then
            sed -i.bak 's|GOOGLE_APPLICATION_CREDENTIALS=.*|GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json|' ../backend/.env
        else
            echo "GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json" >> ../backend/.env
        fi
        print_status "Backend .env file updated"
    else
        print_warning "Backend .env file not found. Please update it manually."
    fi
    
    print_status "Backend credentials configured"
}

show_summary() {
    print_info "Deployment Summary"
    echo -e "${BLUE}==================${NC}"
    
    echo -e "${GREEN}Project ID:${NC} $(terraform output -raw project_id)"
    echo -e "${GREEN}Region:${NC} $(terraform output -raw region)"
    echo -e "${GREEN}VPC Name:${NC} $(terraform output -raw vpc_name)"
    echo -e "${GREEN}Backend Service Account:${NC} $(terraform output -raw backend_api_service_account_email)"
    echo -e "${GREEN}App Storage Bucket:${NC} $(terraform output -raw app_storage_bucket_name)"
    echo -e "${GREEN}Static Assets URL:${NC} $(terraform output -raw static_assets_bucket_url)"
    
    echo ""
    print_status "Infrastructure deployment completed successfully!"
    print_info "Next steps:"
    echo "  1. Configure API keys in backend/.env"
    echo "  2. Deploy backend API to Cloud Run (optional)"
    echo "  3. Build and deploy frontend to Firebase Hosting"
}

cleanup() {
    if [ -f "tfplan" ]; then
        rm tfplan
    fi
}

handle_error() {
    print_error "Deployment failed at step: $1"
    cleanup
    exit 1
}

main() {
    cd "$(dirname "$0")"
    
    trap 'handle_error $LINENO' ERR
    
    check_prerequisites || handle_error "Prerequisites check"
    setup_gcloud || handle_error "Google Cloud setup"
    prepare_terraform || handle_error "Terraform preparation"
    init_terraform || handle_error "Terraform initialization"
    plan_terraform || handle_error "Terraform planning"
    apply_terraform "$1" || handle_error "Terraform apply"
    setup_backend_credentials || handle_error "Backend credentials setup"
    show_summary || handle_error "Summary display"
    
    cleanup
    
    echo ""
    print_status "🎉 SceneHunter V2 infrastructure deployment completed!"
}

show_help() {
    echo "SceneHunter V2 Infrastructure Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --auto-approve    Skip confirmation prompts"
    echo "  --help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                  # Interactive deployment"
    echo "  $0 --auto-approve  # Automatic deployment"
}

case "${1:-}" in
    --help)
        show_help
        exit 0
        ;;
    --auto-approve)
        main --auto-approve
        ;;
    "")
        main
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
