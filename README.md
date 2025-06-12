# SceneHunter V2 🎬

A modern web application for discovering filming locations around the world, built with cutting-edge technologies and Apple-inspired design.

## 🚀 Current Status: PHASE 2 - Google Maps Integration

✅ **Phase 1 Complete** - Foundation & Critical Infrastructure  
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
- **Hot reloading** and **DevTools** support
- **Source maps** for debugging

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

## 🎯 Development Status

### ✅ Completed (Phase 1)
- **State Management Setup** - React Query + Zustand configured
- **Error Monitoring** - Sentry integration complete
- **Authentication System** - Firebase Auth with custom hooks
- **UI Foundation** - Apple-style components and design system
- **Dashboard Implementation** - Functional user dashboard

### 🔄 In Progress (Phase 2)
- **Google Cloud Platform** setup
- **Google Maps** integration
- **Backend API** development

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

