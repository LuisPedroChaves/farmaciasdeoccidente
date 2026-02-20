# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Farmacias de Occidente is an Angular 11 application for managing pharmacy operations, including inventory, sales, orders, deliveries, accounting, and employee management. The application serves two user types: regular users (pharmacy staff) and administrators, each with distinct interfaces and permissions.

## Technology Stack

- **Frontend Framework**: Angular 11.2.5
- **State Management**: NgRx (Store, Effects, DevTools)
- **UI Components**: Angular Material 11.2.4 with Angular Flex Layout
- **Real-time Communication**: Socket.IO (ngx-socket-io)
- **HTTP Loading**: ngx-loading-bar
- **Additional Libraries**:
  - pdfmake (PDF generation)
  - xlsx (Excel file handling)
  - angularx-qrcode (QR code generation)
  - moment/moment-timezone (date handling)
  - simplebar (custom scrollbars)
  - ngx-toasta (notifications)

## Development Commands

### Starting Development Server
```bash
npm start
# Runs on http://localhost:4200/
# Uses NODE_OPTIONS=--openssl-legacy-provider for compatibility
```

### Building the Application
```bash
# Development build
npm run build

# Production build
npm run build:prod

# Vercel deployment build
npm run vercel-build
```

### Testing and Quality
```bash
# Run unit tests (Karma + Jasmine)
npm test

# Run linting (TSLint)
npm run lint

# Run e2e tests (Protractor)
npm run e2e
```

### Angular CLI Commands
```bash
# Generate components (with skipTests: true configured)
ng generate component component-name

# Generate other artifacts
ng generate directive|pipe|service|class|guard|interface|enum|module
```

## Architecture

### Application Structure

```
src/app/
├── core/                      # Core module with singleton services
│   ├── auth/                  # Authentication guards and services
│   ├── models/                # TypeScript interfaces and models
│   ├── services/              # Shared services
│   │   ├── httpServices/      # HTTP API services (35+ services)
│   │   ├── interceptors/      # HTTP interceptors
│   │   ├── config/            # Configuration services
│   │   ├── internal/          # Internal utility services
│   │   └── cdks/              # CDK-related services
│   └── shared/                # Shared utilities and pipes
│       └── pipes/             # Custom pipes (filter, format, time, order, file)
├── pages/
│   ├── layouts/               # Application layout components
│   │   ├── auth-layout/       # Layout for authentication pages
│   │   ├── app-layout/        # Layout for regular user pages
│   │   └── admin-layout/      # Layout for admin pages
│   ├── modules/               # Regular user feature modules (lazy-loaded)
│   ├── admin-modules/         # Admin feature modules (lazy-loaded)
│   └── shared-components/     # Shared UI components
└── store/                     # NgRx state management
    ├── actions/               # Action creators
    ├── reducers/              # State reducers
    └── effects/               # Side effects handlers
```

### Routing Architecture

The application uses **three distinct layout hierarchies**:

1. **Auth Layout** (`/session/*`): Unauthenticated pages (login, not-found)
2. **App Layout** (`/*`): Regular user pages, protected by `AuthGuard`
3. **Admin Layout** (`/admin/*`): Admin pages, protected by `AuthAdminGuard`

All protected routes also use `CheckTokenGuard` for JWT token validation and automatic refresh.

### State Management with NgRx

The application uses NgRx for centralized state management:

- **Session State**: User authentication and session data
- **Config State**: Application configuration
- **Drawer State**: Sidebar/drawer UI state
- **Accounting Cash State**: Cash flow management
- **Accounts Payable State**: Accounts payable tracking
- **Bank State**: Bank account information
- **Check State**: Check/payment tracking

State is managed through actions, reducers, and effects following the Redux pattern.

### Authentication Flow

1. **AuthGuard**: Checks for `farmaciasDO-session` in localStorage
   - Redirects to `/session/signin` if not authenticated
2. **AuthAdminGuard**: Checks for admin user type
   - Redirects appropriately based on user type
3. **CheckTokenGuard**: Validates JWT token expiration
   - Automatically refreshes tokens when approaching expiration (4-hour window)
   - Removes session and redirects to login if token is expired

### HTTP Interceptors

- **AuthInterceptor**: Adds JWT token to all HTTP requests
- Configured globally in app.module.ts

### Environment Configuration

The application uses environment files for configuration:
- `environment.ts` (development): Points to development backend
- `environment.prod.ts` (production): Used during production builds

Key environment properties:
- `root`: Backend API URL
- `production`: Production flag
- `baseurl`: Base URL for routing

## Key Feature Modules

### Regular User Modules (App Layout)
- **Dashboards**: Main dashboard views
- **Orders**: Order management and creation
- **Quotes**: Quote/quotation management
- **Dispatches**: Dispatch tracking
- **Deliveries**: Delivery management
- **Sales**: Sales transactions
- **Customers**: Customer management
- **Storage**: Inventory and warehouse management
- **Transfers**: Inventory transfers between locations
- **Internal Orders**: Orders between pharmacy locations
- **Purchases**: Purchase order management
- **Requests**: Request management

### Admin Modules (Admin Layout)
- **Dashboard**: Admin overview
- **Users**: User account management
- **Employees**: Employee management
- **Payroll**: Payroll processing
- **Reports**: Various reporting tools
- **Products**: Product catalog management
- **Receivables**: Accounts receivable
- **Accounts Payable**: Vendor payments
- **Cash Boxes**: Cash register management
- **Statistics**: Analytics and statistics
- **Brands/Providers**: Brand and provider management
- **Uploads**: File upload management
- **Tickets**: Support ticket system

## Important Development Notes

### Schematics Configuration

Angular schematics are configured to **skip test generation by default** for all artifacts (components, services, directives, guards, etc.). This is defined in [angular.json](angular.json).

### Style Configuration

- Primary styles use **SCSS**
- Theme configuration: `src/assets/styles/themes/theme.scss`
- Global styles: `src/assets/styles/app.scss`

### Real-time Features

The application uses Socket.IO for real-time updates. The socket configuration connects to the backend URL specified in the environment file.

### PDF and Excel Generation

- Use `pdfmake` service for generating PDF documents
- Use `xlsx` library for Excel file import/export operations

### Node.js Version

The project requires **Node.js 20.x** as specified in package.json engines.

### Build Considerations

- All build commands require `NODE_OPTIONS=--openssl-legacy-provider` due to OpenSSL compatibility with Angular 11
- Production builds use file replacements to swap environment files
- Output directory: `dist/farmaciasdeoccidente`

### Deployment

The application is configured for Vercel deployment:
- Build command: `npm run vercel-build`
- Output directory: `dist/farmaciasdeoccidente`
- Routing configured to serve index.html for SPA routing

## Common Patterns

### Creating HTTP Services

HTTP services are located in `src/app/core/services/httpServices/`. When creating new services:
- Extend from base service patterns if available
- Use Angular's HttpClient
- Handle errors appropriately
- Return Observables for async operations

### Working with NgRx

When adding new state:
1. Create actions in `src/app/store/actions/`
2. Create reducer in `src/app/store/reducers/`
3. Create effects in `src/app/store/effects/` if side effects are needed
4. Register in `app.reducer.ts` and effects index
5. Update AppState interface

### Adding Routes

Lazy-loaded modules should be added to [app-routing.module.ts](src/app/app-routing.module.ts):
- Regular user routes: under AppLayoutComponent with AuthGuard and CheckTokenGuard
- Admin routes: under AdminLayoutComponent with AuthAdminGuard and CheckTokenGuard
- Public routes: under AuthLayoutComponent without guards
