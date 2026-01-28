# Part 7: Testing & Quality Assurance

> Rice Mill SaaS Platform - Testing Strategy & Implementation

---

## 1. Testing Strategy

### Test Pyramid

```
           ┌─────────────┐
          ╱   E2E Tests   ╲      ← Few, slow, expensive
         ╱   (10%)        ╲
        ┌───────────────────┐
       ╱  Integration Tests  ╲   ← Medium, moderate speed
      ╱      (30%)           ╲
     ┌─────────────────────────┐
    ╱      Unit Tests          ╲ ← Many, fast, cheap
   ╱         (60%)             ╲
  └───────────────────────────────┘
```

### Testing Tools

| Tool                  | Purpose                 |
| --------------------- | ----------------------- |
| Jest                  | Test framework & runner |
| Supertest             | HTTP testing            |
| mongodb-memory-server | In-memory MongoDB       |
| faker-js              | Test data generation    |

---

## 2. Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/*.spec.js',
    '!src/server.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testTimeout: 10000,
};
```

---

## 3. Test Setup

```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

// Setup: Before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

// Cleanup: After all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clear database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

---

## 4. Unit Tests

### Model Test Example

```javascript
// tests/unit/models/user.model.test.js
const User = require('../../../src/shared/models/user.model');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  describe('Password Hashing', () => {
    it('should hash password before saving', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      };

      const user = await User.create(userData);
      const savedUser = await User.findById(user._id).select('+password');

      expect(savedUser.password).not.toBe('Password123!');
      expect(savedUser.password.length).toBeGreaterThan(20);
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      });

      const hashedPassword = (await User.findById(user._id).select('+password')).password;

      user.name = 'Updated Name';
      await user.save();

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).toBe(hashedPassword);
    });
  });

  describe('comparePassword Method', () => {
    it('should return true for correct password', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      });

      const dbUser = await User.findById(user._id).select('+password');
      const isMatch = await dbUser.comparePassword('Password123!');

      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      });

      const dbUser = await User.findById(user._id).select('+password');
      const isMatch = await dbUser.comparePassword('WrongPassword');

      expect(isMatch).toBe(false);
    });
  });

  describe('Validation', () => {
    it('should require email', async () => {
      const user = new User({
        name: 'Test User',
        password: 'Password123!',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should require valid email format', async () => {
      const user = new User({
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
      });

      await expect(user.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      await User.create({
        name: 'User 1',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      });

      await expect(
        User.create({
          name: 'User 2',
          email: 'test@example.com',
          password: 'Password123!',
          role: 'MILL_STAFF',
        })
      ).rejects.toThrow();
    });
  });
});
```

### Service Test Example

```javascript
// tests/unit/services/auth.service.test.js
const authService = require('../../../src/modules/auth/services/auth.service');
const User = require('../../../src/shared/models/user.model');
const { UnauthorizedError, ConflictError } = require('../../../src/shared/utils/api-error');

describe('Auth Service', () => {
  describe('signUp', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      };

      const user = await authService.signUp(userData);

      expect(user.id).toBeDefined();
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.password).toBeUndefined(); // Should not return password
    });

    it('should throw error for duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      };

      await authService.signUp(userData);

      await expect(authService.signUp(userData)).rejects.toThrow(ConflictError);
    });

    it('should convert email to lowercase', async () => {
      const userData = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123!',
        role: 'MILL_STAFF',
      };

      const user = await authService.signUp(userData);

      expect(user.email).toBe('test@example.com');
    });
  });

  describe('signIn', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
        isActive: true,
      });
    });

    it('should sign in with correct credentials', async () => {
      const result = await authService.signIn(
        'test@example.com',
        'Password123!',
        'test-device',
        '127.0.0.1'
      );

      expect(result.user).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.expiresIn).toBe(900);
    });

    it('should throw error for invalid email', async () => {
      await expect(
        authService.signIn('wrong@example.com', 'Password123!', 'test-device', '127.0.0.1')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error for invalid password', async () => {
      await expect(
        authService.signIn('test@example.com', 'WrongPassword', 'test-device', '127.0.0.1')
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw error for inactive user', async () => {
      await User.updateOne({ email: 'test@example.com' }, { isActive: false });

      await expect(
        authService.signIn('test@example.com', 'Password123!', 'test-device', '127.0.0.1')
      ).rejects.toThrow(UnauthorizedError);
    });
  });
});
```

---

## 5. Integration Tests

### API Test Example

```javascript
// tests/integration/auth.test.js
const request = require('supertest');
const { app } = require('../../src/app');
const User = require('../../src/shared/models/user.model');

describe('Auth API', () => {
  describe('POST /api/v1/auth/sign-up', () => {
    it('should register a new user', async () => {
      const res = await request(app).post('/api/v1/auth/sign-up').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should return 400 for invalid email', async () => {
      const res = await request(app).post('/api/v1/auth/sign-up').send({
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123!',
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 409 for duplicate email', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
      });

      const res = await request(app).post('/api/v1/auth/sign-up').send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(409);
    });
  });

  describe('POST /api/v1/auth/sign-in', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
        isActive: true,
      });
    });

    it('should sign in with correct credentials', async () => {
      const res = await request(app).post('/api/v1/auth/sign-in').send({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.accessToken).toBeDefined();
      expect(res.body.data.refreshToken).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('should return 401 for wrong password', async () => {
      const res = await request(app).post('/api/v1/auth/sign-in').send({
        email: 'test@example.com',
        password: 'WrongPassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should be rate limited after 5 attempts', async () => {
      for (let i = 0; i < 6; i++) {
        await request(app).post('/api/v1/auth/sign-in').send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });
      }

      const res = await request(app).post('/api/v1/auth/sign-in').send({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(res.status).toBe(429); // Too Many Requests
    });
  });

  describe('GET /api/v1/auth/me', () => {
    let accessToken;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123!',
        role: 'MILL_STAFF',
        isActive: true,
      });

      const tokenService = require('../../src/modules/auth/services/token.service');
      accessToken = tokenService.generateAccessToken(user);
    });

    it('should get current user with valid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe('test@example.com');
    });

    it('should return 401 without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');

      expect(res.status).toBe(401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });
  });
});
```

### Purchase API Test

```javascript
// tests/integration/purchase.test.js
const request = require('supertest');
const { app } = require('../../src/app');
const User = require('../../src/shared/models/user.model');
const Mill = require('../../src/shared/models/mill.model');
const Purchase = require('../../src/shared/models/purchase.model');

describe('Purchase API', () => {
  let accessToken;
  let millId;
  let userId;

  beforeEach(async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123!',
      role: 'MILL_ADMIN',
      isActive: true,
    });
    userId = user._id;

    const mill = await Mill.create({
      name: 'Test Mill',
      code: 'TM001',
      address: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      phone: '1234567890',
      ownerId: userId,
      status: 'ACTIVE',
    });
    millId = mill._id;

    await User.updateOne({ _id: userId }, { millId });

    const tokenService = require('../../src/modules/auth/services/token.service');
    accessToken = tokenService.generateAccessToken({ _id: userId, role: 'MILL_ADMIN', millId });
  });

  describe('POST /api/v1/mills/:millId/purchases/paddy', () => {
    it('should create a paddy purchase', async () => {
      const res = await request(app)
        .post(`/api/v1/mills/${millId}/purchases/paddy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: new Date().toISOString(),
          stockType: 'PADDY_MOTA',
          stockCategory: 'paddy',
          quantity: 100,
          ratePerUnit: 2000,
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.quantity).toBe(100);
      expect(res.body.data.purchaseNumber).toBeDefined();
    });

    it('should return 401 without authentication', async () => {
      const res = await request(app).post(`/api/v1/mills/${millId}/purchases/paddy`).send({
        date: new Date().toISOString(),
        stockType: 'PADDY_MOTA',
        stockCategory: 'paddy',
        quantity: 100,
        ratePerUnit: 2000,
      });

      expect(res.status).toBe(401);
    });

    it('should return 403 for different mill', async () => {
      const otherMill = await Mill.create({
        name: 'Other Mill',
        code: 'OM001',
        address: 'Other Address',
        city: 'Other City',
        state: 'Other State',
        pincode: '654321',
        phone: '0987654321',
        ownerId: userId,
        status: 'ACTIVE',
      });

      const res = await request(app)
        .post(`/api/v1/mills/${otherMill._id}/purchases/paddy`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          date: new Date().toISOString(),
          stockType: 'PADDY_MOTA',
          stockCategory: 'paddy',
          quantity: 100,
          ratePerUnit: 2000,
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/v1/mills/:millId/purchases/paddy', () => {
    beforeEach(async () => {
      await Purchase.create({
        purchaseNumber: 'PUR-001',
        millId,
        date: new Date(),
        stockType: 'PADDY_MOTA',
        stockCategory: 'paddy',
        quantity: 100,
        ratePerUnit: 2000,
        grossAmount: 200000,
        netAmount: 200000,
        balanceAmount: 200000,
        createdById: userId,
      });
    });

    it('should get all paddy purchases', async () => {
      const res = await request(app)
        .get(`/api/v1/mills/${millId}/purchases/paddy`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get(`/api/v1/mills/${millId}/purchases/paddy?page=1&limit=10`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(10);
    });
  });
});
```

---

## 6. Test Utilities

### Test Data Factory

```javascript
// tests/utils/factories.js
const { faker } = require('@faker-js/faker');

class TestFactory {
  static createUserData(overrides = {}) {
    return {
      name: faker.person.fullName(),
      email: faker.internet.email().toLowerCase(),
      password: 'Password123!',
      role: 'MILL_STAFF',
      isActive: true,
      ...overrides,
    };
  }

  static createMillData(ownerId, overrides = {}) {
    return {
      name: faker.company.name(),
      code: faker.string.alpha({ length: 6, casing: 'upper' }),
      address: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      pincode: faker.location.zipCode('######'),
      phone: faker.phone.number('##########'),
      ownerId,
      status: 'ACTIVE',
      ...overrides,
    };
  }

  static createPurchaseData(millId, createdById, overrides = {}) {
    const quantity = faker.number.int({ min: 10, max: 1000 });
    const ratePerUnit = faker.number.int({ min: 1000, max: 5000 });

    return {
      purchaseNumber: `PUR-${Date.now()}`,
      millId,
      date: faker.date.recent(),
      stockType: 'PADDY_MOTA',
      stockCategory: 'paddy',
      quantity,
      ratePerUnit,
      grossAmount: quantity * ratePerUnit,
      netAmount: quantity * ratePerUnit,
      balanceAmount: quantity * ratePerUnit,
      createdById,
      ...overrides,
    };
  }
}

module.exports = TestFactory;
```

---

## 7. Running Tests

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:unit": "jest tests/unit",
    "test:integration": "jest tests/integration",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode (development)
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration
```

---

## Next Steps

Continue to:
- [Part 8: Deployment](./implementation-part-8-deployment.md) - Docker, CI/CD, and production deployment
