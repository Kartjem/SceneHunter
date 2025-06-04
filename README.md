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

### 🗺️ Interactive Maps & Locations
- **Google Maps integration** with custom Apple-style theme
- **Interactive location markers** with movie information
- **Location details pages** with comprehensive information
- **Nearby locations discovery** and recommendations

### 📊 Enhanced Dashboard
- **Movie locations map** with sample NYC filming locations
- **Recent activity tracking** with user interactions
- **Popular movies section** with TMDB integration
- **User statistics** and personalized content

### 🎯 State Management
- **React Query (TanStack Query)** for server state management
- **Zustand** for client-side state with persistence
- **Real-time data synchronization** across components

### 🚨 Error Monitoring
- **Sentry integration** for production error tracking
- **Performance monitoring** and source map support
- **Development-friendly** error reporting

### 🎨 Modern UI/UX
- **Apple Design System** with custom color palette
- **Glassmorphism effects** and smooth animations
- **Dark/Light theme support** with system preference detection
- **Responsive design** for all device sizes

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
- **TMDB API** for movie data (planned)
- **Google Maps API** (planned)

### Development Tools
- **ESLint** and **TypeScript** for code quality
- **Hot reloading** and **DevTools** support
- **Source maps** for debugging

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.local.example` to `.env.local` and configure:
```bash
cp .env.local.example .env.local
```

### 3. Configure Firebase
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password and Google)
3. Create Firestore Database
4. Add your Firebase config to `.env.local`

### 4. Run Development Server
```bash
npm run dev
```

### 5. Open Application
Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboard
│   └── layout.tsx         # Root layout with providers
├── components/            # Reusable UI components
│   ├── auth/              # Authentication forms
│   ├── providers/         # Context providers
│   └── ui/                # Base UI components
├── hooks/                 # Custom React hooks
│   ├── use-auth.tsx       # Authentication hook
│   ├── use-movies.tsx     # TMDB API hooks
│   └── use-user-data.tsx  # Firestore data hooks
└── lib/                   # Utilities and configurations
    ├── firebase.ts        # Firebase configuration
    ├── store.ts           # Zustand stores
    └── utils.ts           # Utility functions
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

### 📋 Planned Features
- Interactive maps with filming locations
- Advanced movie search and filtering
- User-generated content and reviews
- Social features and user profiles
- Mobile PWA support

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

## 🐛 Debugging

### Development Tools
- **React Query DevTools** - Available in development mode
- **Zustand DevTools** - Browser extension support
- **Sentry Error Tracking** - Real-time error monitoring

### Console Access
In development, you can access stores in browser console:
```javascript
// Access Zustand stores
window.__ZUSTAND_STORES__
```

## 📚 Documentation

- **Roadmap**: See `ROADMAP.md` for detailed development phases
- **API Documentation**: Coming soon
- **Component Library**: Storybook integration planned

## 🤝 Contributing

1. Follow the existing code style and conventions
2. Use TypeScript for all new components
3. Maintain Apple Design System consistency
4. Add appropriate error handling and loading states
5. Update documentation for new features

## 📄 License

This project is for development and educational purposes.

---

*Built with ❤️ using modern web technologies*