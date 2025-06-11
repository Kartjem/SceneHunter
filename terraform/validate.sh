set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PROJECT_ID="scenehunter-29ff8"
REGION="europe-west1"

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

print_test() {
    echo -e "${BLUE}🧪 Testing: $1${NC}"
}

TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

run_test() {
    local test_name="$1"
    local test_command="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    print_test "$test_name"
    
    if eval "$test_command" >/dev/null 2>&1; then
        print_status "$test_name - PASSED"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        print_error "$test_name - FAILED"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${BLUE}🧪 SceneHunter V2 Infrastructure Validation${NC}"
echo -e "${BLUE}===========================================${NC}"

print_info "Starting infrastructure validation tests..."

run_test "Project accessibility" "gcloud projects describe $PROJECT_ID"

REQUIRED_APIS=(
    "compute.googleapis.com"
    "iam.googleapis.com"
    "firebase.googleapis.com"
    "firestore.googleapis.com"
    "maps-backend.googleapis.com"
    "aiplatform.googleapis.com"
    "storage.googleapis.com"
    "run.googleapis.com"
    "secretmanager.googleapis.com"
)

for api in "${REQUIRED_APIS[@]}"; do
    run_test "API enabled: $api" "gcloud services list --enabled --project=$PROJECT_ID --filter='name:$api' --format='value(name)' | grep -q '$api'"
done

run_test "VPC Network exists" "gcloud compute networks describe scenehunter-dev-vpc --project=$PROJECT_ID"

SUBNETS=("scenehunter-dev-public-subnet" "scenehunter-dev-private-subnet" "scenehunter-dev-db-subnet")
for subnet in "${SUBNETS[@]}"; do
    run_test "Subnet exists: $subnet" "gcloud compute networks subnets describe $subnet --region=$REGION --project=$PROJECT_ID"
done

FIREWALL_RULES=(
    "scenehunter-dev-allow-http-https"
    "scenehunter-dev-allow-ssh"
    "scenehunter-dev-allow-internal"
    "scenehunter-dev-allow-backend-api"
)

for rule in "${FIREWALL_RULES[@]}"; do
    run_test "Firewall rule exists: $rule" "gcloud compute firewall-rules describe $rule --project=$PROJECT_ID"
done

SERVICE_ACCOUNTS=(
    "scenehunter-dev-backend-api"
    "scenehunter-dev-frontend-app"
    "scenehunter-dev-terraform"
)

for sa in "${SERVICE_ACCOUNTS[@]}"; do
    run_test "Service account exists: $sa" "gcloud iam service-accounts describe $sa@$PROJECT_ID.iam.gserviceaccount.com --project=$PROJECT_ID"
done

BUCKETS=(
    "$PROJECT_ID-terraform-state"
    "$PROJECT_ID-app-storage"
    "$PROJECT_ID-static-assets"
    "$PROJECT_ID-backups"
    "$PROJECT_ID-logs"
)

for bucket in "${BUCKETS[@]}"; do
    run_test "Storage bucket exists: $bucket" "gsutil ls -b gs://$bucket"
done

run_test "NAT Gateway exists" "gcloud compute routers describe scenehunter-dev-router --region=$REGION --project=$PROJECT_ID"
run_test "NAT configuration exists" "gcloud compute routers get-nat-mapping-info scenehunter-dev-router --region=$REGION --project=$PROJECT_ID --nat-name=scenehunter-dev-nat"

run_test "Secret Manager secret exists" "gcloud secrets describe scenehunter-dev-backend-api-key --project=$PROJECT_ID"

run_test "Custom IAM role exists" "gcloud iam roles describe scenehunterBackend --project=$PROJECT_ID"

run_test "Backend SA has Firebase Admin role" "gcloud projects get-iam-policy $PROJECT_ID --flatten='bindings[].members' --format='table(bindings.role)' --filter='bindings.members:scenehunter-dev-backend-api@$PROJECT_ID.iam.gserviceaccount.com AND bindings.role:roles/firebase.admin'"

run_test "Static assets bucket public access" "gsutil iam get gs://$PROJECT_ID-static-assets | grep -q 'allUsers'"

run_test "VPC Peering connection exists" "gcloud services vpc-peerings list --network=scenehunter-dev-vpc --project=$PROJECT_ID"

if [ -f "../backend/serviceAccountKey.json" ]; then
    run_test "Backend service account key file exists" "test -f ../backend/serviceAccountKey.json"
    run_test "Backend service account key is valid JSON" "python3 -m json.tool ../backend/serviceAccountKey.json"
else
    print_warning "Backend service account key file not found. Run Terraform to generate it."
fi

if [ -f "../backend/.env" ]; then
    run_test "Backend .env has PROJECT_ID" "grep -q 'FIREBASE_PROJECT_ID=' ../backend/.env"
    run_test "Backend .env has credentials path" "grep -q 'GOOGLE_APPLICATION_CREDENTIALS=' ../backend/.env"
else
    print_warning "Backend .env file not found."
fi


print_info "Running advanced connectivity tests..."

run_test "Can create/delete test storage object" "echo 'test' | gsutil cp - gs://$PROJECT_ID-app-storage/test.txt && gsutil rm gs://$PROJECT_ID-app-storage/test.txt"

SA_EMAIL="scenehunter-dev-backend-api@$PROJECT_ID.iam.gserviceaccount.com"
run_test "Service account can access secrets" "gcloud secrets versions access latest --secret=scenehunter-dev-backend-api-key --project=$PROJECT_ID --impersonate-service-account=$SA_EMAIL"



print_info "Running security and performance checks..."

run_test "Terraform state bucket prevents public access" "gsutil iam get gs://$PROJECT_ID-terraform-state | grep -q 'allUsers' && exit 1 || exit 0"
run_test "App storage bucket prevents public access" "gsutil iam get gs://$PROJECT_ID-app-storage | grep -q 'allUsers' && exit 1 || exit 0"

run_test "No firewall rules allow all ports from anywhere" "gcloud compute firewall-rules list --project=$PROJECT_ID --format='value(allowed[].ports,sourceRanges[])' | grep -q '0-65535.*0.0.0.0/0' && exit 1 || exit 0"

echo ""
echo -e "${BLUE}📊 Test Results Summary${NC}"
echo -e "${BLUE}======================${NC}"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo -e "${BLUE}Total:  $TOTAL_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo ""
    print_status "🎉 All tests passed! Infrastructure is correctly deployed."
    echo ""
    print_info "Infrastructure validation completed successfully."
    print_info "Task 0.1 - Google Cloud Platform Setup and IaC: COMPLETED ✅"
    exit 0
else
    echo ""
    print_error "❌ Some tests failed. Please check the infrastructure."
    echo ""
    print_info "Common fixes:"
    echo "  - Run 'terraform apply' to ensure all resources are created"
    echo "  - Check IAM permissions for your user account"
    echo "  - Verify project billing is enabled"
    echo "  - Ensure all required APIs are enabled"
    exit 1
fi
