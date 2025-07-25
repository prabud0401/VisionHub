# VisionHub AI - Current Tech Stack & Architecture

## 🏗️ Project Overview

VisionHub AI has evolved from a simple POC into a comprehensive, production-ready AI creative platform. The application now features enterprise-grade architecture, advanced AI capabilities, and a complete ecosystem including web and mobile applications.

## 🚀 Live Deployment
**Production URL**: [https://studio--visionhub-uffkz.us-central1.hosted.app/](https://studio--visionhub-uffkz.us-central1.hosted.app/)

## 🔧 Current Technology Stack

### Core Framework & Language
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.3.3 | React framework with App Router |
| **TypeScript** | 5.x | Type-safe development |
| **React** | 18.3.1 | UI library |
| **Node.js** | 22.x | Runtime environment |

### Styling & UI
| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.1 | Utility-first styling |
| **ShadCN UI** | Latest | Component library |
| **Radix UI** | Various | Accessible primitives |
| **Lucide React** | 0.480.0 | Icon library |
| **Tailwind Animate** | 1.0.7 | Animation utilities |

### AI & Generation
| Technology | Version | Purpose |
|------------|---------|---------|
| **Google AI Gemini** | Latest | Primary AI model |
| **Genkit** | 1.13.0 | AI framework |
| **@genkit-ai/googleai** | 1.13.0 | Google AI integration |
| **@genkit-ai/next** | 1.13.0 | Next.js integration |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **Firebase** | 10.12.2 | Backend platform |
| **Firebase Admin** | 12.1.1 | Server-side operations |
| **Firestore** | - | NoSQL database |
| **Firebase Auth** | - | Authentication |
| **Firebase Storage** | - | File storage |

### State Management & Forms
| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.6 | Global state management |
| **React Hook Form** | 7.54.2 | Form handling |
| **Zod** | 3.24.2 | Schema validation |

### Development & Tools
| Technology | Version | Purpose |
|------------|---------|---------|
| **TypeScript** | 5.x | Type checking |
| **ESLint** | Latest | Code linting |
| **PostCSS** | 8.x | CSS processing |
| **Patch Package** | 8.0.0 | Package modifications |

## 🏛️ Architecture Overview

### Application Structure
```
VisionHub/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (app)/             # Authenticated app routes
│   │   ├── (marketing)/       # Public marketing pages
│   │   └── admin/             # Admin panel
│   ├── components/            # Reusable UI components
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── landing/           # Landing page components
│   │   ├── layout/            # Layout components
│   │   └── ui/               # Base UI components (ShadCN)
│   ├── ai/                   # AI generation logic
│   │   └── flows/            # Individual AI workflows
│   ├── services/             # API services
│   ├── stores/               # Zustand state stores
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── context/              # React contexts
└── mobile/                   # React Native app
```

### Key Architectural Patterns

#### 1. **Modular Component Architecture**
- **Container/Presentation Pattern**: Logic separated from UI
- **Compound Components**: Complex UI broken into focused components
- **Error Boundaries**: Comprehensive error handling
- **Memoization**: Performance optimization with React.memo

#### 2. **State Management Strategy**
- **Zustand**: Global state for app-wide data
- **React Hook Form**: Form-specific state
- **Context API**: Authentication and theme
- **Local State**: Component-specific state

#### 3. **AI Generation Pipeline**
```typescript
User Input → Form Validation → AI Service → Progress Tracking → Result Storage → Gallery Update
```

## 🔥 Firebase Services Configuration

### Authentication
- **Providers**: Email/Password, Google OAuth
- **Features**: Email verification, password reset
- **Security**: Admin-level access control

### Firestore Database
- **Collections**: `users`, `images`, `payments`, `admin_stats`
- **Security Rules**: Role-based access control
- **Indexing**: Optimized queries for performance

### Storage
- **Organization**: User-based folder structure
- **Security**: Authenticated access only
- **Optimization**: Image compression and formats

### Hosting
- **Platform**: Firebase App Hosting
- **CDN**: Global content distribution
- **SSL**: Automatic HTTPS

## 🎨 UI/UX Implementation

### Design System
```scss
:root {
  --primary: #A080FF;      /* Vibrant violet */
  --background: #1A1329;   /* Dark violet */
  --accent: #80BFFF;       /* Analogous blue */
  --card: #2A1F3D;         /* Card background */
  --border: #3D2F4F;       /* Border color */
}
```

### Component Library
- **Base Components**: ShadCN UI with custom styling
- **Custom Components**: Application-specific UI elements
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 compliance

### Animation & Effects
- **CSS Animations**: Custom keyframes and transitions
- **Loading States**: Skeleton components
- **Progress Indicators**: Real-time generation progress
- **Micro-interactions**: Hover effects and state changes

## 🛠️ Features Implementation

### Core Features

#### 1. **AI Image Generation**
```typescript
// AI Generation Flow
const generateImage = async (prompt: string, options: GenerationOptions) => {
  const flow = await import('@/ai/flows/generate-image');
  return await flow.generateImage({ prompt, ...options });
};
```

#### 2. **Advanced AI Tools**
- **Prompt Enhancer**: AI-powered prompt improvement
- **Image-to-Prompt**: Reverse engineering prompts from images
- **Background Removal**: AI-powered background extraction
- **Image Upscaling**: AI enhancement and outpainting

#### 3. **User Management**
- **Authentication**: Firebase Auth integration
- **Profile Management**: User settings and preferences
- **Credit System**: Purchase and usage tracking
- **Gallery**: Personal image collection

#### 4. **Admin Panel**
- **Dashboard**: Real-time statistics
- **User Management**: CRUD operations
- **Image Management**: Content moderation
- **Payment Processing**: Credit purchase approval

### Mobile Application

| Technology | Version | Purpose |
|------------|---------|---------|
| **Expo** | ~51.0.0 | React Native framework |
| **React Native** | 0.74.0 | Mobile app framework |
| **TypeScript** | ~5.3.3 | Type-safe mobile development |

```typescript
// React Native Structure
mobile/
├── src/
│   ├── screens/           # Mobile screens
│   │   ├── AuthScreen.tsx
│   │   ├── CameraScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── GalleryScreen.tsx
│   │   └── SettingsScreen.tsx
│   ├── navigation/        # React Navigation
│   │   └── AppNavigator.tsx
│   ├── context/          # Shared contexts
│   │   └── AuthContext.tsx
│   ├── services/         # API services
│   │   └── VisionHubAPI.ts
│   ├── types/            # TypeScript definitions
│   └── utils/            # Utilities
│       └── theme.ts
├── App.tsx               # Root component
└── app.json             # Expo configuration
```

## 🔒 Security Implementation

### Environment Variables
```env
# Client-side (public)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Server-side (private)
FIREBASE_SERVICE_ACCOUNT_KEY=
GEMINI_API_KEY=
ADMIN_SECRET_CODE=
```

### Security Measures
- **API Key Protection**: Server-side only
- **Admin Authentication**: Multi-factor verification
- **Data Validation**: Zod schema validation
- **Rate Limiting**: API usage restrictions
- **CORS Configuration**: Restricted origins

## 📊 Performance Optimizations

### Frontend Performance
- **Code Splitting**: Dynamic imports for heavy components
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Intersection Observer API
- **Memoization**: React.memo, useCallback, useMemo
- **Bundle Analysis**: Webpack bundle analyzer

### Backend Performance
- **Database Indexing**: Optimized Firestore queries
- **Caching**: Firebase caching strategies
- **CDN**: Global content delivery
- **Compression**: Image and asset compression

## 🔄 Development Workflow

### Scripts
```json
{
  "dev": "next dev -p 9002",
  "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
  "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit"
}
```

### Development Tools
- **Hot Reload**: Next.js fast refresh
- **Type Checking**: Real-time TypeScript validation
- **Linting**: ESLint with custom rules
- **Debugging**: Genkit AI development tools

## 🚀 Deployment & Infrastructure

### Hosting Platform
- **Primary**: Firebase App Hosting
- **CDN**: Firebase CDN
- **SSL**: Automatic certificate management
- **Monitoring**: Firebase Analytics and Crashlytics

### Environment Management
- **Development**: Local development server
- **Staging**: Firebase preview channels
- **Production**: Firebase production hosting

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: Lighthouse integration
- **Error Tracking**: React Error Boundaries
- **Usage Analytics**: Firebase Analytics
- **Performance Metrics**: Real User Monitoring

### Business Metrics
- **User Engagement**: Generation statistics
- **Credit Usage**: Purchase and consumption tracking
- **Feature Adoption**: Tool usage analytics
- **Admin Insights**: User and content management stats

## 🔮 Future Enhancements

### Planned Features
- [ ] **AI Video Generation**: Extended media capabilities
- [ ] **Advanced Editor**: In-app image editing tools
- [ ] **Collaboration**: Shared galleries and projects
- [ ] **API Access**: Public API for developers
- [ ] **Mobile Web**: PWA implementation

### Technical Improvements
- [ ] **Offline Support**: Service worker implementation
- [ ] **Real-time Sync**: WebSocket integration
- [ ] **Advanced Caching**: Redis implementation
- [ ] **Microservices**: Service decomposition
- [ ] **Testing**: E2E test coverage

## 📚 Documentation Links

- [Original Project Plan](./original-project-plan.md)
- [Improvements Log](../IMPROVEMENTS.md)
- [Blueprint](./blueprint.md)
- [Firebase Setup](../FIREBASE_INDEX_SETUP.md)

---

**Last Updated**: December 2024  
**Current Version**: 2.0 (Production Ready)  
**Maintained By**: VisionHub Development Team 