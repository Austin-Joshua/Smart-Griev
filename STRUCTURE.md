# Smart Griev Project Structure

## Project Overview

**Project Name**: Smart Griev - Citizen Care Connect  
**Version**: 1.0.0  
**Type**: React + TypeScript Frontend Application  
**Build Tool**: Vite

## Directory Structure

### Root Level (`/`)
- `frontend/` - Main application folder containing all frontend code
- `.gitignore` - Git ignore rules
- `package.json` - Root package.json with convenience scripts
- `package-lock.json` - Dependency lock file
- `bun.lockb` - Bun lock file
- `README.md` - Project documentation
- `tsconfig.json` - Root TypeScript configuration

### Frontend Application (`/frontend`)

#### Configuration Files
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Vitest testing configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration
- `components.json` - shadcn-ui configuration
- `tsconfig.app.json` - App-specific TypeScript configuration
- `tsconfig.node.json` - Build tools TypeScript configuration
- `package.json` - Frontend dependencies and scripts
- `index.html` - HTML entry point

#### Source Code (`/frontend/src`)

```
src/
├── assets/              # Static assets (images, fonts, etc.)
├── components/          # Reusable React components
│   ├── ui/             # shadcn-ui components
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── GrievanceCard.tsx
│   ├── NavLink.tsx
│   ├── StatCard.tsx
│   └── StatusTimeline.tsx
├── config/             # Configuration and constants
├── hooks/              # Custom React hooks
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── layouts/            # Layout components
├── lib/                # Utility functions and helpers
│   └── utils.ts
├── pages/              # Page components
│   ├── AdminDashboard.tsx
│   ├── CitizenDashboard.tsx
│   ├── Index.tsx
│   ├── NotFound.tsx
│   ├── OfficerDashboard.tsx
│   └── SubmitGrievance.tsx
├── services/           # API services and data fetching
├── test/               # Test files
│   ├── example.test.ts
│   └── setup.ts
├── types/              # TypeScript type definitions
├── App.css             # Global component styles
├── App.tsx             # Root React component
├── index.css           # Global styles and Tailwind imports
├── main.tsx            # Application entry point
└── vite-env.d.ts       # Vite environment type definitions
```

#### Public Assets (`/frontend/public`)
- `favicon.ico` - Site favicon
- `placeholder.svg` - Placeholder image
- `robots.txt` - SEO robots configuration

## Key Changes Made

1. **Project Renamed**: Changed from `vite_react_shadcn_ts` to `smart-griev`
2. **Reorganized Structure**: Moved all source code into a dedicated `frontend/` directory
3. **Proper Folder Hierarchy**: Created organized subdirectories in `src/`:
   - `assets/` - For static files
   - `config/` - For configuration
   - `types/` - For TypeScript definitions
   - `services/` - For API calls
   - `layouts/` - For layout components
4. **Centralized Configuration**: All build and configuration files moved to `frontend/`
5. **Root Scripts**: Added convenient npm scripts in root `package.json` that proxy to frontend scripts

## Available Scripts

From the root directory:

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run build:dev        # Build in development mode
npm run lint             # Run ESLint
npm run preview          # Preview production build
npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run install-all      # Install all dependencies
```

## Development Workflow

1. **Starting Development**:
   ```bash
   npm run install-all    # First time setup
   npm run dev            # Start development server
   ```

2. **Creating Components**: Add new components to `src/components/`

3. **Adding Pages**: Add new pages to `src/pages/`

4. **API Integration**: Add API services to `src/services/`

5. **Type Definitions**: Add types to `src/types/`

6. **Building**: Run `npm run build` for production-ready files

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI Library |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| Tailwind CSS | Styling |
| shadcn-ui | Component Library |
| React Router | Navigation |
| React Hook Form | Form Management |
| React Query | Data Fetching |
| Zod | Schema Validation |
| Recharts | Data Visualization |
| Sonner | Notifications |
| Vitest | Testing Framework |

## Notes

- All frontend code should be placed within the `frontend/` directory
- Configuration files are now properly organized and referenced within frontend directory
- The root `package.json` serves as a convenience layer for running scripts
- Lock files (package-lock.json, bun.lockb) are maintained at root level for dependency consistency
