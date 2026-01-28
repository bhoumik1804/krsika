# Part 4: API Modules & Controllers

> Rice Mill SaaS Platform - API Endpoints, Controllers & Services

---

## 1. API Architecture

### REST API Design Principles

- **RESTful**: Resource-based URLs
- **Versioned**: `/api/v1/...`
- **Stateless**: Each request contains all necessary information
- **HTTP Methods**: GET (read), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: Proper HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- **Pagination**: For list endpoints
- **Filtering**: Query parameters for filtering
- **Sorting**: Sortable by various fields

---

## 2. API Endpoints Overview

### Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://api.ricemillsaas.com/api/v1
```

### Module Structure

```
/api/v1/
├── /auth                 # Authentication
├── /admin                # Super Admin
└── /mills/:millId        # Mill-specific operations
    ├── /dashboard
    ├── /staff
    ├── /purchases
    ├── /sales
    ├── /inward
    ├── /outward
    ├── /milling
    ├── /financial
    ├── /stock
    ├── /labour
    ├── /balance-lifting
    ├── /reports
    └── /masters
```

---

## 3. Authentication Module (`/api/v1/auth`)

### Endpoints

| Method | Endpoint           | Description            | Auth Required |
| ------ | ------------------ | ---------------------- | ------------- |
| POST   | `/sign-in`         | User login             | No            |
| POST   | `/sign-up`         | User registration      | No            |
| POST   | `/refresh-token`   | Refresh access token   | No            |
| POST   | `/logout`          | Logout current device  | Yes           |
| POST   | `/logout-all`      | Logout all devices     | Yes           |
| GET    | `/me`              | Get current user       | Yes           |
| GET    | `/sessions`        | Get active sessions    | Yes           |

### Controller Implementation

```javascript
// src/modules/auth/controllers/auth.controller.js
const authService = require('../services/auth.service');
const asyncHandler = require('../../../shared/utils/async-handler');
const ApiResponse = require('../../../shared/utils/api-response');

class AuthController {
  signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const deviceInfo = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await authService.signIn(email, password, deviceInfo, ipAddress);

    res.json(ApiResponse.success(result, 'Login successful'));
  });

  signUp = asyncHandler(async (req, res) => {
    const user = await authService.signUp(req.body);

    res.status(201).json(ApiResponse.created({ user }, 'Registration successful'));
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const deviceInfo = req.headers['user-agent'];
    const ipAddress = req.ip;

    const result = await authService.refreshToken(refreshToken, deviceInfo, ipAddress);

    res.json(ApiResponse.success(result, 'Token refreshed'));
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);

    res.json(ApiResponse.success(null, 'Logged out successfully'));
  });

  logoutAll = asyncHandler(async (req, res) => {
    await authService.logoutAll(req.user._id);

    res.json(ApiResponse.success(null, 'Logged out from all devices'));
  });

  me = asyncHandler(async (req, res) => {
    res.json(ApiResponse.success(req.user));
  });

  getSessions = asyncHandler(async (req, res) => {
    const sessions = await authService.getUserSessions(req.user._id);

    res.json(ApiResponse.success(sessions));
  });
}

module.exports = new AuthController();
```

---

## 4. Purchase Module (`/api/v1/mills/:millId/purchases`)

### Endpoints

| Method | Endpoint                      | Description           | Permission              |
| ------ | ----------------------------- | --------------------- | ----------------------- |
| GET    | `/paddy`                      | List paddy purchases  | mill:purchase:read      |
| POST   | `/paddy`                      | Create paddy purchase | mill:purchase:create    |
| GET    | `/paddy/:id`                  | Get purchase by ID    | mill:purchase:read      |
| PUT    | `/paddy/:id`                  | Update purchase       | mill:purchase:update    |
| DELETE | `/paddy/:id`                  | Delete purchase       | mill:purchase:delete    |
| GET    | `/rice`                       | List rice purchases   | mill:purchase:read      |
| POST   | `/rice`                       | Create rice purchase  | mill:purchase:create    |

### Service Layer Example

```javascript
// src/modules/purchase/services/paddy-purchase.service.js
const Purchase = require('../../../shared/models/purchase.model');
const Stock = require('../../../shared/models/stock.model');
const { NotFoundError } = require('../../../shared/utils/api-error');
const { PURCHASE_DEAL_TYPES } = require('../../../shared/constants');

class PaddyPurchaseService {
  async findAll(millId, options) {
    const { page = 1, limit = 10, sortBy = 'date', sortOrder = 'desc', filters } = options;

    const query = { millId, stockCategory: 'paddy' };

    // Apply filters
    if (filters.partyId) query.partyId = filters.partyId;
    if (filters.startDate) query.date = { $gte: new Date(filters.startDate) };
    if (filters.endDate) query.date = { ...query.date, $lte: new Date(filters.endDate) };
    if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const [data, total] = await Promise.all([
      Purchase.find(query)
        .populate('partyId', 'name phone')
        .populate('brokerId', 'name commissionRate')
        .populate('deliveryOrderId', 'doNumber')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Purchase.countDocuments(query),
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async findById(millId, id) {
    const purchase = await Purchase.findOne({ _id: id, millId })
      .populate('partyId')
      .populate('brokerId')
      .populate('deliveryOrderId')
      .populate('createdById', 'name email')
      .lean();

    if (!purchase) {
      throw new NotFoundError('Purchase not found');
    }

    return purchase;
  }

  async create(millId, dto, createdById) {
    // Generate purchase number
    const count = await Purchase.countDocuments({ millId });
    const purchaseNumber = `PUR-${Date.now()}-${count + 1}`;

    // Calculate amounts
    const grossAmount = dto.quantity * dto.ratePerUnit;
    const discountAmount = (grossAmount * (dto.discountPercent || 0)) / 100;
    const netAmount = grossAmount - discountAmount;

    const purchaseData = {
      ...dto,
      purchaseNumber,
      millId,
      grossAmount,
      discountAmount,
      netAmount,
      balanceAmount: netAmount - (dto.paidAmount || 0),
      createdById,
    };

    const purchase = await Purchase.create(purchaseData);

    // Update stock
    await this.updateStock(millId, dto.stockType, dto.quantity, 'add');

    return purchase;
  }

  async update(millId, id, dto) {
    const purchase = await Purchase.findOne({ _id: id, millId });

    if (!purchase) {
      throw new NotFoundError('Purchase not found');
    }

    // Recalculate if quantity/rate changed
    if (dto.quantity || dto.ratePerUnit || dto.discountPercent) {
      const quantity = dto.quantity || purchase.quantity;
      const ratePerUnit = dto.ratePerUnit || purchase.ratePerUnit;
      const discountPercent = dto.discountPercent || purchase.discountPercent;

      dto.grossAmount = quantity * ratePerUnit;
      dto.discountAmount = (dto.grossAmount * discountPercent) / 100;
      dto.netAmount = dto.grossAmount - dto.discountAmount;
      dto.balanceAmount = dto.netAmount - (dto.paidAmount || purchase.paidAmount);
    }

    Object.assign(purchase, dto);
    await purchase.save();

    return purchase;
  }

  async delete(millId, id) {
    const purchase = await Purchase.findOneAndDelete({ _id: id, millId });

    if (!purchase) {
      throw new NotFoundError('Purchase not found');
    }

    // Reverse stock update
    await this.updateStock(millId, purchase.stockType, purchase.quantity, 'subtract');

    return purchase;
  }

  async updateStock(millId, stockType, quantity, operation) {
    const stock = await Stock.findOne({ millId, stockType });

    if (stock) {
      stock.quantity = operation === 'add' ? stock.quantity + quantity : stock.quantity - quantity;
      await stock.save();
    } else if (operation === 'add') {
      await Stock.create({ millId, stockType, quantity });
    }
  }
}

module.exports = new PaddyPurchaseService();
```

### Controller Example

```javascript
// src/modules/purchase/controllers/paddy-purchase.controller.js
const PaddyPurchaseService = require('../services/paddy-purchase.service');
const asyncHandler = require('../../../shared/utils/async-handler');
const ApiResponse = require('../../../shared/utils/api-response');

class PaddyPurchaseController {
  getAll = asyncHandler(async (req, res) => {
    const { millId } = req.params;
    const result = await PaddyPurchaseService.findAll(millId, req.query);

    res.json(ApiResponse.paginated(result.data, result.pagination));
  });

  getById = asyncHandler(async (req, res) => {
    const { millId, id } = req.params;
    const purchase = await PaddyPurchaseService.findById(millId, id);

    res.json(ApiResponse.success(purchase));
  });

  create = asyncHandler(async (req, res) => {
    const { millId } = req.params;
    const purchase = await PaddyPurchaseService.create(millId, req.body, req.user._id);

    // Emit real-time event
    req.app.get('io').to(`mill:${millId}`).emit('purchase:created', purchase);

    res.status(201).json(ApiResponse.created(purchase));
  });

  update = asyncHandler(async (req, res) => {
    const { millId, id } = req.params;
    const purchase = await PaddyPurchaseService.update(millId, id, req.body);

    req.app.get('io').to(`mill:${millId}`).emit('purchase:updated', purchase);

    res.json(ApiResponse.success(purchase, 'Purchase updated successfully'));
  });

  delete = asyncHandler(async (req, res) => {
    const { millId, id } = req.params;
    await PaddyPurchaseService.delete(millId, id);

    req.app.get('io').to(`mill:${millId}`).emit('purchase:deleted', { id });

    res.json(ApiResponse.success(null, 'Purchase deleted successfully'));
  });
}

module.exports = new PaddyPurchaseController();
```

### Routes Configuration

```javascript
// src/modules/purchase/routes/purchase.routes.js
const { Router } = require('express');
const passport = require('passport');
const { authorize } = require('../../auth/middlewares/authorize');
const { validateRequest } = require('../../../shared/middlewares/validate-request');
const paddyPurchaseController = require('../controllers/paddy-purchase.controller');
const ricePurchaseController = require('../controllers/rice-purchase.controller');
const { createPurchaseSchema, updatePurchaseSchema } = require('../validators/purchase.validator');

const router = Router({ mergeParams: true });

// Authentication required for all routes
router.use(passport.authenticate('jwt-access', { session: false }));

// Paddy Purchase Routes
router
  .route('/paddy')
  .get(authorize('mill:purchase:read'), paddyPurchaseController.getAll)
  .post(
    authorize('mill:purchase:create'),
    validateRequest(createPurchaseSchema),
    paddyPurchaseController.create
  );

router
  .route('/paddy/:id')
  .get(authorize('mill:purchase:read'), paddyPurchaseController.getById)
  .put(
    authorize('mill:purchase:update'),
    validateRequest(updatePurchaseSchema),
    paddyPurchaseController.update
  )
  .delete(authorize('mill:purchase:delete'), paddyPurchaseController.delete);

// Rice Purchase Routes
router
  .route('/rice')
  .get(authorize('mill:purchase:read'), ricePurchaseController.getAll)
  .post(
    authorize('mill:purchase:create'),
    validateRequest(createPurchaseSchema),
    ricePurchaseController.create
  );

module.exports = router;
```

---

## 5. Dashboard Module

### Dashboard Statistics Service

```javascript
// src/modules/mill/services/dashboard.service.js
const Purchase = require('../../../shared/models/purchase.model');
const Sale = require('../../../shared/models/sale.model');
const Stock = require('../../../shared/models/stock.model');
const Receipt = require('../../../shared/models/receipt.model');
const Payment = require('../../../shared/models/payment.model');

class DashboardService {
  async getMillStats(millId) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      todayPurchases,
      todaySales,
      totalStock,
      pendingPayables,
      pendingReceivables,
      monthlyRevenue,
    ] = await Promise.all([
      this.getTodayPurchases(millId, today),
      this.getTodaySales(millId, today),
      this.getTotalStock(millId),
      this.getPendingPayables(millId),
      this.getPendingReceivables(millId),
      this.getMonthlyRevenue(millId),
    ]);

    return {
      todayPurchases,
      todaySales,
      totalStock,
      pendingPayables,
      pendingReceivables,
      monthlyRevenue,
    };
  }

  async getTodayPurchases(millId, today) {
    const purchases = await Purchase.aggregate([
      {
        $match: {
          millId: mongoose.Types.ObjectId(millId),
          date: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalAmount: { $sum: '$netAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return purchases[0] || { totalQuantity: 0, totalAmount: 0, count: 0 };
  }

  async getTodaySales(millId, today) {
    const sales = await Sale.aggregate([
      {
        $match: {
          millId: mongoose.Types.ObjectId(millId),
          date: { $gte: today },
        },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalAmount: { $sum: '$netAmount' },
          count: { $sum: 1 },
        },
      },
    ]);

    return sales[0] || { totalQuantity: 0, totalAmount: 0, count: 0 };
  }

  async getTotalStock(millId) {
    const stock = await Stock.aggregate([
      {
        $match: { millId: mongoose.Types.ObjectId(millId) },
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$quantity' },
          totalValue: { $sum: '$totalValue' },
        },
      },
    ]);

    return stock[0] || { totalQuantity: 0, totalValue: 0 };
  }

  async getPendingPayables(millId) {
    const payables = await Purchase.aggregate([
      {
        $match: {
          millId: mongoose.Types.ObjectId(millId),
          paymentStatus: { $in: ['PENDING', 'PARTIAL'] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$balanceAmount' },
        },
      },
    ]);

    return payables[0]?.totalAmount || 0;
  }

  async getPendingReceivables(millId) {
    const receivables = await Sale.aggregate([
      {
        $match: {
          millId: mongoose.Types.ObjectId(millId),
          paymentStatus: { $in: ['PENDING', 'PARTIAL'] },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$balanceAmount' },
        },
      },
    ]);

    return receivables[0]?.totalAmount || 0;
  }

  async getMonthlyRevenue(millId) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const revenue = await Sale.aggregate([
      {
        $match: {
          millId: mongoose.Types.ObjectId(millId),
          date: { $gte: startOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$netAmount' },
        },
      },
    ]);

    return revenue[0]?.totalRevenue || 0;
  }
}

module.exports = new DashboardService();
```

---

## 6. Route Aggregation

### V1 API Routes

```javascript
// src/routes/v1/index.js
const { Router } = require('express');
const authRoutes = require('../../modules/auth/routes/auth.routes');
const adminRoutes = require('../../modules/admin/routes/admin.routes');
const millRoutes = require('../../modules/mill/routes/mill.routes');

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/mills/:millId', millRoutes);

module.exports = router;
```

### Mill Routes Aggregator

```javascript
// src/modules/mill/routes/mill.routes.js
const { Router } = require('express');
const dashboardRoutes = require('./dashboard.routes');
const staffRoutes = require('../../staff/routes/staff.routes');
const purchaseRoutes = require('../../purchase/routes/purchase.routes');
const saleRoutes = require('../../sales/routes/sale.routes');
const stockRoutes = require('../../inventory/routes/stock.routes');
const masterRoutes = require('../../masters/routes/master.routes');

const router = Router({ mergeParams: true });

router.use('/dashboard', dashboardRoutes);
router.use('/staff', staffRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/sales', saleRoutes);
router.use('/stock', stockRoutes);
router.use('/masters', masterRoutes);

module.exports = router;
```

---

## 7. Zod Validators

### Purchase Validator Example

```javascript
// src/modules/purchase/validators/purchase.validator.js
const { z } = require('zod');

const createPurchaseSchema = z.object({
  body: z.object({
    date: z.string().transform((val) => new Date(val)),
    partyId: z.string().optional(),
    brokerId: z.string().optional(),
    stockType: z.string().min(1, 'Stock type is required'),
    stockCategory: z.enum(['paddy', 'rice', 'gunny', 'frk', 'other']),
    quantity: z.number().positive('Quantity must be positive'),
    ratePerUnit: z.number().positive('Rate must be positive'),
    discountPercent: z.number().min(0).max(100).optional(),
    brokeragePerUnit: z.number().min(0).optional(),
    remarks: z.string().optional(),
  }),
});

const updatePurchaseSchema = z.object({
  body: z.object({
    date: z.string().transform((val) => new Date(val)).optional(),
    partyId: z.string().optional(),
    brokerId: z.string().optional(),
    quantity: z.number().positive().optional(),
    ratePerUnit: z.number().positive().optional(),
    discountPercent: z.number().min(0).max(100).optional(),
    paidAmount: z.number().min(0).optional(),
    paymentStatus: z.enum(['PENDING', 'PARTIAL', 'PAID']).optional(),
    remarks: z.string().optional(),
  }),
});

module.exports = { createPurchaseSchema, updatePurchaseSchema };
```

---

## Next Steps

Continue to:
- [Part 5: Real-Time Features](./implementation-part-5-realtime-features.md) - Socket.io implementation
- [Part 6: Error Handling & Logging](./implementation-part-6-error-logging.md) - Error handling and Winston logger
