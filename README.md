# Smart Griev - Citizen Care Connect

A comprehensive grievance management system for efficient citizen feedback and complaint resolution.

## Project Structure

```
smart-griev/
├── frontend/                 # Frontend application
│   ├── src/
│   │   ├── assets/          # Static assets
│   │   ├── components/      # Reusable React components
│   │   │   └── ui/          # shadcn-ui components
│   │   ├── config/          # Configuration files
│   │   ├── hooks/           # Custom React hooks
│   │   ├── layouts/         # Layout components
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── test/            # Test files
│   │   ├── types/           # TypeScript type definitions
│   │   ├── App.css          # Global styles
│   │   ├── App.tsx          # Root component
│   │   ├── index.css        # Tailwind CSS imports
│   │   ├── main.tsx         # Application entry point
│   │   └── vite-env.d.ts    # Vite environment types
│   ├── public/              # Static files
│   ├── components.json      # shadcn-ui configuration
│   ├── eslint.config.js     # ESLint configuration
│   ├── index.html           # HTML entry point
│   ├── package.json         # Frontend dependencies
│   ├── postcss.config.js    # PostCSS configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   ├── tsconfig.app.json    # TypeScript config (app)
│   ├── tsconfig.json        # TypeScript config (root)
│   ├── tsconfig.node.json   # TypeScript config (build tools)
│   ├── vite.config.ts       # Vite configuration
│   └── vitest.config.ts     # Vitest configuration
├── .gitignore
├── package.json             # Root package.json (scripts only)
├── package-lock.json
├── bun.lockb
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```sh
# Install all dependencies
npm run install-all

# Or install individually
npm install
cd frontend
npm install
```

### Development

```sh
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

### Building

```sh
# Build for production
npm run build

# Build for development
npm run build:dev

# Preview the production build
npm run preview
```

### Testing

```sh
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

### Linting

```sh
# Run ESLint
npm run lint
```

## Technologies Used

This project is built with:

- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe JavaScript
- **React 18** - UI library
- **shadcn-ui** - High-quality React components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **React Query** - Server state management
- **Zod** - TypeScript-first schema validation
- **Recharts** - Data visualization
- **Sonner** - Toast notifications

## Features

- Role-based dashboards (Citizen, Officer, Admin)
- Grievance submission and tracking
- Real-time status updates
- Statistical analytics
- Responsive design

## Development Workflow

1. All frontend code is located in the `frontend/` directory
2. Make changes to files in `frontend/src/`
3. The dev server will hot-reload your changes
4. Commit changes to git
5. Push to repository

## Additional Resources

- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn-ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
