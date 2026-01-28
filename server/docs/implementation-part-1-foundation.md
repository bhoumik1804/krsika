# Part 1: Foundation & Architecture

> Rice Mill SaaS Platform - Backend Implementation

---

## 1. Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│                     (React + TypeScript + Vite)                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/REST + WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│                    (Express + Rate Limiting + CORS)                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            ▼                       ▼                       ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────┐
│   AUTH SERVICE    │   │   CORE SERVICE    │   │  SOCKET SERVICE   │
│   (Passport.js)   │   │   (Business)      │   │   (Socket.io)     │
└───────────────────┘   └───────────────────┘   └───────────────────┘
            │                       │                       │
            └───────────────────────┼───────────────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA ACCESS LAYER                                  │
│                      (Mongoose ODM + MongoDB)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                        ┌───────────────────┐
                        │     MongoDB       │
                        │   (Primary DB)    │
                        └───────────────────┘
```

### Microservices-Ready Modular Monolith

The architecture follows a **modular monolith** pattern that can easily evolve into microservices:

- **Bounded Contexts**: Each module is self-contained
- **Shared Kernel**: Common utilities and infrastructure
- **Event-Driven**: Internal event bus for module communication
- **API Versioning**: Support for multiple API versions

---

## 2. Technology Stack

### Core Technologies

| Category       | Technology      | Purpose                 |
| -------------- | --------------- | ----------------------- |
| Runtime        | Node.js (Latest)| Server runtime          |
| Language       | JavaScript (ES6+)| Development language   |
| Framework      | Express.js 4.x  | HTTP server             |
| ODM            | Mongoose 8.x    | MongoDB object modeling |
| Database       | MongoDB 7.x     | Primary database        |
| Authentication | Passport.js     | Auth strategies         |
| Real-time      | Socket.io 4.x   | WebSocket communication |
| Validation     | Zod             | Schema validation       |

### Development Tools

| Tool            | Purpose           |
| --------------- | ----------------- |
| ESLint          | Code linting      |
| Prettier        | Code formatting   |
| Jest            | Unit testing      |
| Supertest       | API testing       |
| Docker          | Containerization  |
| Husky           | Git hooks         |
| Swagger/OpenAPI | API documentation |
| Nodemon         | Development server |

### Security Packages

| Package            | Purpose                       |
| ------------------ | ----------------------------- |
| helmet             | HTTP security headers         |
| cors               | Cross-origin resource sharing |
| express-rate-limit | Rate limiting                 |
| bcrypt             | Password hashing              |
| jsonwebtoken       | JWT handling                  |
| express-mongo-sanitize | NoSQL injection prevention |

---

## 3. Project Structure

```
server/
├── src/
│   ├── app.js                          # Express app setup
│   ├── server.js                       # Server entry point
│   │
│   ├── config/                         # Configuration
│   │   ├── index.js                    # Config aggregator
│   │   ├── database.js                 # MongoDB config
│   │   ├── auth.js                     # Auth config (JWT secrets)
│   │   ├── socket.js                   # Socket.io config
│   │   └── env.js                      # Environment variables
│   │
│   ├── modules/                        # Feature modules (Bounded Contexts)
│   │   │
│   │   ├── auth/                       # Authentication Module
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.js
│   │   │   ├── services/
│   │   │   │   ├── auth.service.js
│   │   │   │   └── token.service.js
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.js
│   │   │   │   ├── local.strategy.js
│   │   │   │   ├── google.strategy.js
│   │   │   │   └── github.strategy.js
│   │   │   ├── middlewares/
│   │   │   │   ├── authenticate.js
│   │   │   │   └── authorize.js
│   │   │   ├── validators/
│   │   │   │   └── auth.validator.js
│   │   │   ├── routes/
│   │   │   │   └── auth.routes.js
│   │   │   └── index.js
│   │   │
│   │   ├── user/                       # User Management Module
│   │   ├── mill/                       # Mill Management Module
│   │   ├── staff/                      # Staff Management Module
│   │   ├── purchase/                   # Purchase Module
│   │   ├── sales/                      # Sales Module
│   │   ├── inventory/                  # Inventory/Stock Module
│   │   ├── inward/                     # Inward Module
│   │   ├── outward/                    # Outward Module
│   │   ├── milling/                    # Milling/Processing Module
│   │   ├── financial/                  # Financial Module
│   │   ├── labour/                     # Labour Cost Module
│   │   ├── balance-lifting/            # Balance Lifting Module
│   │   ├── reports/                    # Reports Module
│   │   ├── masters/                    # Master Data Module
│   │   ├── subscription/               # Subscription Module
│   │   └── notification/               # Notification Module
│   │
│   ├── shared/                         # Shared Infrastructure
│   │   ├── database/
│   │   │   ├── connection.js           # MongoDB connection
│   │   │   └── seed.js                 # Database seeding
│   │   │
│   │   ├── models/                     # Mongoose Models (see Part 2)
│   │   │
│   │   ├── socket/
│   │   │   ├── index.js
│   │   │   └── handlers/
│   │   │
│   │   ├── middlewares/
│   │   │   ├── error-handler.js
│   │   │   ├── not-found.js
│   │   │   ├── request-logger.js
│   │   │   ├── rate-limiter.js
│   │   │   ├── validate-request.js
│   │   │   ├── cors.js
│   │   │   └── security.js
│   │   │
│   │   ├── utils/
│   │   │   ├── api-response.js
│   │   │   ├── api-error.js
│   │   │   ├── async-handler.js
│   │   │   ├── pagination.js
│   │   │   ├── date.js
│   │   │   ├── string.js
│   │   │   └── calculation.js
│   │   │
│   │   ├── constants/                  # ✅ Created from client
│   │   │   ├── index.js
│   │   │   ├── roles.js
│   │   │   ├── stock-types.js
│   │   │   ├── payment-types.js
│   │   │   ├── transaction-types.js
│   │   │   ├── purchase-types.js
│   │   │   ├── sale-types.js
│   │   │   ├── inward-outward-types.js
│   │   │   ├── misc-types.js
│   │   │   ├── error-codes.js
│   │   │   ├── pagination.js
│   │   │   └── app-config.js
│   │   │
│   │   └── events/
│   │       ├── event-emitter.js
│   │       └── event-types.js
│   │
│   └── routes/
│       └── v1/
│           └── index.js                # API v1 route aggregator
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── scripts/
│   └── seed.js
│
├── docs/
│   ├── implementation-part-1-foundation.md (this file)
│   ├── implementation-part-2-database.md
│   └── ...
│
├── .env
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
└── README.md
```

---

## 4. Development Setup

### Prerequisites

- Node.js 22.x or later
- MongoDB 7.x
- Docker (optional, for containerization)
- Git

### Installation Steps

#### 1. Clone Repository

```bash
git clone <repository-url>
cd mill-project/server
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Environment Setup

Create `.env` file from example:

```bash
cp .env.example .env
```

Update environment variables:

```env
# Server
NODE_ENV=development
PORT=5000
API_VERSION=v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ricemill

# JWT Secrets (MUST BE DIFFERENT)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-min-32-characters
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-different-secret-refresh-token-key-min-32-characters
REFRESH_TOKEN_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Logging
LOG_LEVEL=debug
```

#### 4. Start MongoDB

**Option A: Docker**
```bash
docker-compose up -d mongo
```

**Option B: Local Installation**
```bash
mongod --dbpath /path/to/data
```

#### 5. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

---

## 5. Package.json

```json
{
  "name": "ricemill-api",
  "version": "1.0.0",
  "description": "Rice Mill SaaS Platform Backend",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "format": "prettier --write src/",
    "seed": "node scripts/seed.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.21.0",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^7.4.0",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "mongoose": "^8.6.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.1",
    "passport-local": "^1.0.0",
    "socket.io": "^4.7.5",
    "uuid": "^10.0.0",
    "winston": "^3.14.2",
    "winston-daily-rotate-file": "^5.0.0",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "eslint": "^9.10.0",
    "jest": "^29.7.0",
    "mongodb-memory-server": "^10.0.0",
    "nodemon": "^3.1.4",
    "prettier": "^3.3.3",
    "supertest": "^7.0.0"
  }
}
```

---

## 6. Configuration Files

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
  },
};
```

### Prettier Configuration

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always"
}
```

### Nodemon Configuration

```json
{
  "watch": ["src"],
  "ext": "js,json",
  "ignore": ["src/**/*.test.js"],
  "exec": "node src/server.js"
}
```

---

## 7. Git Ignore

```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# Testing
coverage/

# Build
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Misc
*.pid
*.seed
*.pid.lock
```

---

## Next Steps

Continue to:
- [Part 2: Database Design](./implementation-part-2-database.md) - Mongoose schemas and data models
- [Part 3: Authentication & Security](./implementation-part-3-auth-security.md) - JWT and Passport.js setup
