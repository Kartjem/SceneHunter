# SceneHunter V2 🎬

A modern web application for discovering filming locations around the world, built with cutting-edge technologies and Apple-inspired design.

## 🚀 Current Status: PHASE 2 - Enhanced Features & CI/CD

✅ **Phase 1 Complete** - Foundation & Critical Infrastructure  
✅ **CI/CD Pipeline Complete** - Enterprise-ready deployment pipeline  
🔄 **Phase 2 In Progress** - Google Maps Integration & Enhanced Features

## ✨ Features

### 🔐 Authentication System
- **Firebase Authentication** with Email/Password and Google OAuth
- **Secure user sessions** with automatic state management
- **Apple-style forms** with glassmorphism effects

### 🎯 State Management
- **React Query (TanStack Query)** for server state management
- **Zustand** for client-side state with persistence
- **Real-time data synchronization** across components

### 🚨 Error Monitoring
- **Sentry integration** for production error tracking
- **Development-friendly** error reporting

### 🔄 CI/CD Pipeline
- **Google Cloud Build** for automated builds and testing
- **Cloud Deploy** with staged rollouts (dev → staging → production)
- **Jest testing framework** with 42 comprehensive tests
- **Docker containerization** with multi-stage optimization
- **GitHub Actions** integration with automated triggers
- **Security scanning** for containers and dependencies
- **Infrastructure as Code** with Kubernetes manifests

## 🛠 Tech Stack
### Frontend
- **Next.js 15.3.3** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** with custom Apple-inspired design system
- **ShadCN/UI** components
- **React Query** for data fetching and caching
- **Zustand** for state management

### Backend & Services
- **Firebase** (Auth, Firestore, Storage)
- **Sentry** for error monitoring

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Jest** testing framework with comprehensive test suite
- **Hot reloading** and **DevTools** support
- **Source maps** for debugging

### DevOps & Infrastructure
- **Google Cloud Build** for CI/CD automation
- **Cloud Deploy** for staged deployment management
- **Docker** containerization with production optimization
- **Kubernetes** orchestration with environment-specific configs
- **Artifact Registry** for container image storage

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```


### 2. Configure Firebase
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create Firestore Database
4. Add your Firebase config to `.env.local`

### 3. Run Development Server
```bash
npm run dev
```

### 4. Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

## 🎯 Development Status

### ✅ Completed (Phase 1)
- **State Management Setup** - React Query + Zustand configured
- **Error Monitoring** - Sentry integration complete
- **Authentication System** - Firebase Auth with custom hooks
- **UI Foundation** - Apple-style components and design system
- **Dashboard Implementation** - Functional user dashboard

### ✅ Completed (CI/CD Pipeline - Task 0.4)
- **Testing Framework** - Jest with 42 comprehensive tests (47% code coverage)
- **Docker Containerization** - Multi-stage production-ready builds
- **Google Cloud Build** - Automated CI/CD pipeline with testing integration
- **Cloud Deploy** - Staged rollouts with dev/staging/production environments
- **Kubernetes Infrastructure** - Complete manifests with environment-specific configs
- **GitHub Actions** - Automated triggers and deployment notifications
- **Security Integration** - Container scanning and dependency audits

### 🔄 In Progress (Phase 2)
- **Google Maps** integration
- **Backend API** development
- **Enhanced location features**

## 🔧 Available Scripts

### Development
- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

### Testing
- `npm test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode for development
- `npm run test:coverage` - Generate test coverage report
- `npm run test:ci` - Run tests in CI mode (no watch, with coverage)

## 🚀 Deployment

The application includes a complete CI/CD pipeline powered by Google Cloud:

### Automated Deployment
1. **Push to main branch** → GitHub Actions trigger
2. **Cloud Build executes**:
   - Runs comprehensive test suite (42 tests)
   - Builds optimized Docker container
   - Performs security scanning
   - Pushes to Artifact Registry
3. **Auto-deploy to dev environment**
4. **Manual approval gates** for staging/production
5. **Canary deployment** strategy for production rollouts

### Infrastructure
- **Kubernetes clusters** for each environment (dev/staging/prod)
- **Environment-specific configurations** with Kustomize
- **Health checks** and monitoring endpoints
- **Automatic rollback** capabilities on failure

### Manual Deployment
```bash
# Build Docker image locally
docker build -t scenehunter-v2 .

# Deploy to specific environment
kubectl apply -k k8s/dev      # Development
kubectl apply -k k8s/staging  # Staging  
kubectl apply -k k8s/prod     # Production
```

## 🧪 Testing

The application includes a comprehensive testing suite with **42 tests** covering:

### Test Coverage
- **Unit Tests**: Individual component testing (LoginForm, SignupForm, utilities)
- **Integration Tests**: Authentication flow and user interactions
- **Library Tests**: Firebase integration and utility functions
- **Code Coverage**: 47.42% statements, 48.03% branches

### Test Structure
```
src/__tests__/
├── components/           # Component unit tests
│   ├── LoginForm.test.tsx
│   ├── SignupForm.test.tsx
│   └── ...
├── integration/          # Integration tests
│   └── auth.test.tsx
├── lib/                  # Library and utility tests
│   ├── firestore.test.ts
│   └── utils.test.ts
└── setup.test.ts         # Jest configuration test
```

### Running Tests
```bash
npm test                  # Run all tests
npm run test:watch        # Development mode with auto-reload
npm run test:coverage     # Generate coverage report
npm run test:ci          # CI mode (used in deployment pipeline)
```

### Firebase Mocking
Tests include comprehensive Firebase mocking for:
- **Authentication**: Email/password and Google OAuth flows
- **Firestore**: Database operations and user data management
- **Error Handling**: Various authentication and database error scenarios

## 📁 Project Structure

```
├── 📦 CI/CD Pipeline
│   ├── cloudbuild.yaml           # Google Cloud Build configuration
│   ├── clouddeploy.yaml          # Cloud Deploy pipeline
│   ├── skaffold.yaml             # Deployment orchestration
│   ├── Dockerfile                # Production container build
│   └── .github/workflows/        # GitHub Actions automation
│
├── ☸️ Kubernetes Infrastructure
│   ├── k8s/base/                 # Base Kubernetes manifests
│   ├── k8s/dev/                  # Development environment
│   ├── k8s/staging/              # Staging environment
│   └── k8s/production/           # Production environment
│
├── 🧪 Testing Framework
│   ├── jest.config.js            # Jest configuration
│   ├── jest.setup.js             # Test setup and mocking
│   ├── jest-dom.d.ts             # TypeScript definitions
│   └── src/__tests__/            # Test suites
│
├── 🎨 Application Source
│   ├── src/app/                  # Next.js App Router pages
│   ├── src/components/           # Reusable UI components
│   ├── src/hooks/                # Custom React hooks
│   ├── src/lib/                  # Utility libraries
│   └── src/types/                # TypeScript type definitions
│
└── ⚙️ Configuration
    ├── next.config.js            # Next.js configuration
    ├── tailwind.config.js        # Tailwind CSS setup
    ├── tsconfig.json             # TypeScript configuration
    └── package.json              # Dependencies and scripts
```



