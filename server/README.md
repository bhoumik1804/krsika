# Mill Project - Backend Server

Express.js backend with MongoDB, Socket.IO, and role-based access control (RBAC).

## Architecture

- **REST API** - Authentication only (login, register, logout, refresh, Google OAuth)
- **Socket.IO** - All other operations (admin, mill, staff data operations)

## Features

- ✅ JWT authentication with HTTP-only cookies
- ✅ Google OAuth 2.0 integration
- ✅ Role-based access control (super-admin, mill-admin, mill-staff)
- ✅ Permission-based access for mill-staff
- ✅ Socket.IO for real-time operations
- ✅ Winston logging to single file
- ✅ MongoDB with Mongoose
- ✅ Zod validation
- ✅ Security middleware (helmet, CORS, rate limiting)

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- MongoDB 6.0+

### Installation

1. Install dependencies:

```bash
npm install
# or
bun install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secrets (use different secrets for access and refresh tokens)
   - Google OAuth credentials (optional)
   - Super admin credentials

### Database Setup

The application will automatically connect to MongoDB on startup. Make sure your MongoDB instance is running.

### Seed Super Admin

Before running the server for the first time, seed the super admin accounts:

```bash
npm run seed:admin
# or
bun run seed:admin
```

This will create super admin accounts using the credentials from your `.env` file.

### Development

Start the development server with hot reload:

```bash
npm run dev
# or
bun run dev
```

Server will be available at: `http://localhost:5000`

### Production

Start the production server:

```bash
npm start
# or
bun start
```

## Project Structure

```
server/
├── src/
│   ├── config/          # Configuration files
│   │   ├── db.js        # MongoDB connection
│   │   ├── passport.js  # Passport strategies
│   │   ├── cookie.js    # Cookie configuration
│   │   └── env.js       # Environment validation
│   ├── models/          # Mongoose models
│   │   ├── User.js      # User model (all roles)
│   │   ├── Mill.js      # Mill model
│   │   └── RefreshToken.js
│   ├── controllers/     # Request handlers
│   │   └── authController.js
│   ├── services/        # Business logic
│   │   ├── authService.js
│   │   ├── tokenService.js
│   │   └── googleAuthService.js
│   ├── middlewares/     # Express middleware
│   │   ├── auth.js      # JWT verification
│   │   ├── roleGuard.js # Role-based access
│   │   ├── permissionGuard.js
│   │   ├── validate.js  # Zod validation
│   │   └── errorHandler.js
│   ├── validators/      # Zod schemas
│   │   ├── authValidators.js
│   │   ├── userValidators.js
│   │   └── millValidators.js
│   ├── routes/          # REST API routes
│   │   ├── index.js
│   │   └── authRoutes.js
│   ├── socket/          # Socket.IO handlers
│   │   ├── index.js     # Socket setup
│   │   ├── adminHandlers.js
│   │   ├── millHandlers.js
│   │   └── staffHandlers.js
│   ├── utils/           # Utilities
│   │   ├── logger.js    # Winston logger
│   │   ├── ApiError.js
│   │   └── ApiResponse.js
│   ├── scripts/         # Utility scripts
│   │   └── seed-admin.js
│   ├── app.js           # Express app setup
│   └── index.js         # Entry point
├── logs/                # Log files
│   └── app.log
├── .env                 # Environment variables
├── .env.example         # Example environment file
└── package.json
```

## API Documentation

### REST API Endpoints

Base URL: `http://localhost:5000/api/v1`

#### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/login` | Login with email/password | Public |
| POST | `/auth/google/login` | Login with Google token | Public |
| GET | `/auth/google` | Google OAuth redirect | Public |
| GET | `/auth/google/callback` | Google OAuth callback | Public |
| POST | `/auth/refresh` | Refresh access token | Public |
| POST | `/auth/logout` | Logout | Authenticated |
| GET | `/auth/me` | Get current user | Authenticated |
| PUT | `/auth/profile` | Update profile | Authenticated |
| POST | `/auth/change-password` | Change password | Authenticated |

### Socket.IO Events

See [plan.md](./plan.md) for complete Socket.IO event documentation.

## Role Hierarchy

```
super-admin
    └── Manages all mills and mill-admins
    └── Can access all dashboards

mill-admin
    └── Owns one or multiple mills
    └── Manages mill-staff for their mills
    └── Assigns permissions to staff

mill-staff
    └── Belongs to one mill
    └── Access based on assigned permissions
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| NODE_ENV | Environment (development/production) | Yes |
| PORT | Server port | Yes |
| MONGODB_URI | MongoDB connection string | Yes |
| MONGODB_DATABASE_NAME | Database name | Yes |
| ACCESS_TOKEN_SECRET | JWT access token secret | Yes |
| REFRESH_TOKEN_SECRET | JWT refresh token secret | Yes |
| CLIENT_URL | Frontend URL | Yes |
| GOOGLE_CLIENT_ID | Google OAuth client ID | Optional |
| GOOGLE_CLIENT_SECRET | Google OAuth client secret | Optional |
| LOG_LEVEL | Logging level (debug/info/warn/error) | No |

## Security

- HTTP-only cookies for tokens
- CSRF protection with SameSite cookies
- Rate limiting on API endpoints
- Helmet.js security headers
- MongoDB injection prevention
- Input validation with Zod

## Logging

Logs are written to `logs/app.log` with rotation:
- Max file size: 10MB
- Max files: 5 backups
- Includes timestamps, levels, and stack traces

## License

ISC
