# Part 2: Database Design

> Rice Mill SaaS Platform - Database Schema & Models

---

## 1. Database Overview

### MongoDB Choice Rationale

- **Flexible Schema**: Rice mill operations have varying data structures
- **Scalability**: Horizontal scaling for multi-tenant SaaS
- **Performance**: Fast reads/writes for real-time operations
- **JSON Native**: Perfect match for Node.js and React ecosystem

### Database Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collections:                                                    │
│  ├── users                    (Authentication & Users)           │
│  ├── refreshtokens            (JWT Refresh Tokens)              │
│  ├── mills                    (Mill Master Data)                │
│  ├── subscriptions            (Subscription Plans)              │
│  │                                                               │
│  ├── staffs                   (Staff Management)                │
│  ├── attendances              (Daily Attendance)                │
│  │                                                               │
│  ├── parties                  (Customers/Suppliers)             │
│  ├── brokers                  (Broker Master)                   │
│  ├── transporters             (Transporter Master)              │
│  ├── committees               (Committee/Sangathan)             │
│  ├── vehicles                 (Vehicle Master)                  │
│  ├── deliveryorders           (DO Master)                       │
│  ├── labourgroups             (Labour Group Master)             │
│  │                                                               │
│  ├── purchases                (Purchase Transactions)           │
│  ├── sales                    (Sale Transactions)               │
│  ├── inwards                  (Inward Transactions)             │
│  ├── outwards                 (Outward Transactions)            │
│  ├── millings                 (Milling Operations)              │
│  │                                                               │
│  ├── receipts                 (Receipt Vouchers)                │
│  ├── payments                 (Payment Vouchers)                │
│  ├── labourcosts              (Labour Cost Tracking)            │
│  │                                                               │
│  ├── stocks                   (Stock/Inventory)                 │
│  └── auditlogs                (Audit Trail)                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────┐
│    User     │────1:N──│ RefreshToken │
└──────┬──────┘         └──────────────┘
       │
       │ 1:N (owns mills)
       ▼
┌─────────────┐         ┌──────────────┐
│    Mill     │────1:1──│ Subscription │
└──────┬──────┘         └──────────────┘
       │
       │ 1:N (all mill-specific entities)
       ├──────────────────────────────────────────┐
       │              │              │            │
       ▼              ▼              ▼            ▼
┌──────────┐   ┌──────────┐   ┌──────────┐  ┌──────────┐
│  Staff   │   │  Party   │   │  Broker  │  │Committee │
└────┬─────┘   └────┬─────┘   └────┬─────┘  └────┬─────┘
     │              │              │             │
     │              │              │             │
     │              └──────┬───────┴─────────────┘
     │                     │
     ▼                     ▼
┌────────────┐      ┌────────────┐
│ Attendance │      │ Transactions (Purchase, Sale, etc.) │
└────────────┘      └──────┬─────┘
                           │
                           ▼
                    ┌────────────┐
                    │   Stock    │
                    └────────────┘
```

---

## 3. Core Mongoose Models

### 3.1 User Model

```javascript
// src/shared/models/user.model.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { USER_ROLES } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't include password in queries by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.MILL_STAFF,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: function () {
        return this.role !== USER_ROLES.SUPER_ADMIN;
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ millId: 1 });
userSchema.index({ role: 1, isActive: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to generate public profile
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    avatar: this.avatar,
    phone: this.phone,
    role: this.role,
    isActive: this.isActive,
    millId: this.millId,
  };
};

module.exports = mongoose.model('User', userSchema);
```

### 3.2 Refresh Token Model

```javascript
// src/shared/models/refresh-token.model.js
const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    deviceInfo: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    isRevoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// TTL index - MongoDB will automatically delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index for faster lookups
refreshTokenSchema.index({ userId: 1, isRevoked: 1 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
```

### 3.3 Mill Model

```javascript
// src/shared/models/mill.model.js
const mongoose = require('mongoose');
const { MILL_STATUS } = require('../constants');

const millSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mill name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Mill code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [/^[A-Z0-9]{3,10}$/, 'Mill code must be 3-10 uppercase alphanumeric characters'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
    },
    state: {
      type: String,
      required: [true, 'State is required'],
    },
    pincode: {
      type: String,
      required: [true, 'Pincode is required'],
      match: [/^\d{6}$/, 'Pincode must be 6 digits'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    gstNumber: {
      type: String,
      uppercase: true,
      trim: true,
      match: [/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GST number format'],
    },
    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN number format'],
    },
    status: {
      type: String,
      enum: Object.values(MILL_STATUS),
      default: MILL_STATUS.PENDING,
    },
    logo: {
      type: String,
      default: null,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
millSchema.index({ code: 1 });
millSchema.index({ ownerId: 1 });
millSchema.index({ status: 1 });

module.exports = mongoose.model('Mill', millSchema);
```

### 3.4 Staff Model

```javascript
// src/shared/models/staff.model.js
const mongoose = require('mongoose');
const { STAFF_ROLES } = require('../constants');

const staffSchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Optional: link to user account
    },
    name: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: Object.values(STAFF_ROLES),
      required: [true, 'Staff role is required'],
    },
    salary: {
      type: Number,
      required: [true, 'Salary is required'],
      min: [0, 'Salary cannot be negative'],
    },
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
    },
    address: {
      type: String,
    },
    aadharNumber: {
      type: String,
      match: [/^\d{12}$/, 'Aadhar must be 12 digits'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
staffSchema.index({ millId: 1, isActive: 1 });
staffSchema.index({ millId: 1, role: 1 });

module.exports = mongoose.model('Staff', staffSchema);
```

### 3.5 Attendance Model

```javascript
// src/shared/models/attendance.model.js
const mongoose = require('mongoose');
const { ATTENDANCE_STATUS } = require('../constants');

const attendanceSchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
    },
    staffId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(ATTENDANCE_STATUS),
      default: ATTENDANCE_STATUS.PRESENT,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index - one attendance record per staff per day
attendanceSchema.index({ millId: 1, staffId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });

module.exports = mongoose.model('Attendance', attendanceSchema);
```

---

## 4. Master Data Models

### 4.1 Party Model

```javascript
// src/shared/models/party.model.js
const mongoose = require('mongoose');

const partySchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Party name is required'],
      trim: true,
    },
    gstn: {
      type: String,
      uppercase: true,
      trim: true,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: String,
    city: String,
    state: String,
    pincode: String,
    bankName: String,
    accountNumber: String,
    ifscCode: String,
    openingBalance: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
partySchema.index({ millId: 1, isActive: 1 });
partySchema.index({ millId: 1, name: 1 });

module.exports = mongoose.model('Party', partySchema);
```

### 4.2 Broker Model

```javascript
// src/shared/models/broker.model.js
const mongoose = require('mongoose');

const brokerSchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Broker name is required'],
      trim: true,
    },
    phone: String,
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    address: String,
    commissionRate: {
      type: Number,
      default: 0,
      min: [0, 'Commission rate cannot be negative'],
    },
    openingBalance: {
      type: Number,
      default: 0,
    },
    currentBalance: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
brokerSchema.index({ millId: 1, isActive: 1 });

module.exports = mongoose.model('Broker', brokerSchema);
```

### 4.3 Delivery Order (DO) Model

```javascript
// src/shared/models/delivery-order.model.js
const mongoose = require('mongoose');
const { DO_STATUS } = require('../constants');

const deliveryOrderSchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    doNumber: {
      type: String,
      required: [true, 'DO number is required'],
      trim: true,
    },
    committeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Committee',
    },
    year: {
      type: String,
      required: [true, 'Year is required'],
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
    receivedQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Received quantity cannot be negative'],
    },
    balanceQuantity: {
      type: Number,
      required: true,
      min: [0, 'Balance quantity cannot be negative'],
    },
    status: {
      type: String,
      enum: Object.values(DO_STATUS),
      default: DO_STATUS.ACTIVE,
    },
    remarks: String,
  },
  {
    timestamps: true,
  }
);

// Indexes
deliveryOrderSchema.index({ millId: 1 });
deliveryOrderSchema.index({ doNumber: 1 });
deliveryOrderSchema.index({ status: 1 });

// Pre-save hook to update status based on quantities
deliveryOrderSchema.pre('save', function (next) {
  this.balanceQuantity = this.totalQuantity - this.receivedQuantity;

  if (this.balanceQuantity === 0) {
    this.status = DO_STATUS.COMPLETED;
  } else if (this.receivedQuantity > 0) {
    this.status = DO_STATUS.PARTIAL;
  }

  next();
});

module.exports = mongoose.model('DeliveryOrder', deliveryOrderSchema);
```

---

## 5. Transaction Models

### 5.1 Purchase Model

```javascript
// src/shared/models/purchase.model.js
const mongoose = require('mongoose');
const {
  STOCK_TYPES,
  DELIVERY_TYPES,
  PURCHASE_DEAL_TYPES,
  PAYMENT_STATUS,
} = require('../constants');

const purchaseSchema = new mongoose.Schema(
  {
    purchaseNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
      index: true,
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
    },
    deliveryType: {
      type: String,
      enum: Object.values(DELIVERY_TYPES),
    },
    purchaseType: {
      type: String,
      enum: Object.values(PURCHASE_DEAL_TYPES),
    },
    deliveryOrderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryOrder',
    },
    doQuantity: Number,

    // Stock Details
    stockType: {
      type: String,
      required: true,
    },
    stockCategory: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      default: 'quintal',
    },
    ratePerUnit: {
      type: Number,
      required: true,
      min: [0, 'Rate cannot be negative'],
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    brokeragePerUnit: {
      type: Number,
      default: 0,
      min: [0, 'Brokerage cannot be negative'],
    },

    // Gunny Details
    gunnyType: String,
    gunnyNewQty: Number,
    gunnyOldQty: Number,
    gunnyPlasticQty: Number,
    gunnyNewRate: Number,
    gunnyOldRate: Number,
    gunnyPlasticRate: Number,

    // Calculated Totals
    grossAmount: {
      type: Number,
      required: true,
      min: [0, 'Gross amount cannot be negative'],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative'],
    },
    netAmount: {
      type: Number,
      required: true,
      min: [0, 'Net amount cannot be negative'],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    balanceAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    remarks: String,
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
purchaseSchema.index({ millId: 1, date: -1 });
purchaseSchema.index({ partyId: 1, date: -1 });
purchaseSchema.index({ stockCategory: 1, date: -1 });
purchaseSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Purchase', purchaseSchema);
```

### 5.2 Sale Model

```javascript
// src/shared/models/sale.model.js
const mongoose = require('mongoose');
const { SALE_DEAL_TYPES, PAYMENT_STATUS } = require('../constants');

const saleSchema = new mongoose.Schema(
  {
    saleNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
      index: true,
    },
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Broker',
    },
    saleType: {
      type: String,
      enum: Object.values(SALE_DEAL_TYPES),
    },

    // Stock Details
    stockType: {
      type: String,
      required: true,
    },
    stockCategory: {
      type: String,
      required: true,
      index: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    unit: {
      type: String,
      default: 'quintal',
    },
    ratePerUnit: {
      type: Number,
      required: true,
      min: [0, 'Rate cannot be negative'],
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    brokeragePerUnit: {
      type: Number,
      default: 0,
      min: [0, 'Brokerage cannot be negative'],
    },

    // Gunny Details
    gunnyNewQty: Number,
    gunnyOldQty: Number,
    gunnyPlasticQty: Number,
    gunnyNewRate: Number,
    gunnyOldRate: Number,
    gunnyPlasticRate: Number,

    // Calculated Totals
    grossAmount: {
      type: Number,
      required: true,
      min: [0, 'Gross amount cannot be negative'],
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: [0, 'Discount amount cannot be negative'],
    },
    netAmount: {
      type: Number,
      required: true,
      min: [0, 'Net amount cannot be negative'],
    },
    receivedAmount: {
      type: Number,
      default: 0,
      min: [0, 'Received amount cannot be negative'],
    },
    balanceAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
      default: PAYMENT_STATUS.PENDING,
    },

    remarks: String,
    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
saleSchema.index({ millId: 1, date: -1 });
saleSchema.index({ partyId: 1, date: -1 });
saleSchema.index({ stockCategory: 1, date: -1 });
saleSchema.index({ paymentStatus: 1 });

module.exports = mongoose.model('Sale', saleSchema);
```

### 5.3 Stock Model

```javascript
// src/shared/models/stock.model.js
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema(
  {
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
    },
    stockType: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock quantity cannot be negative'],
    },
    unit: {
      type: String,
      default: 'quintal',
    },
    avgRate: {
      type: Number,
      default: 0,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    warehouseLocation: String,
    minStockLevel: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index - one stock record per mill per stock type
stockSchema.index({ millId: 1, stockType: 1 }, { unique: true });

module.exports = mongoose.model('Stock', stockSchema);
```

---

## 6. Financial Models

### 6.1 Receipt Model

```javascript
// src/shared/models/receipt.model.js
const mongoose = require('mongoose');
const { PAYMENT_MODES } = require('../constants');

const receiptSchema = new mongoose.Schema(
  {
    receiptNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    mode: {
      type: String,
      enum: Object.values(PAYMENT_MODES),
      required: true,
    },
    referenceNumber: String,
    chequeNumber: String,
    chequeDate: Date,
    bankName: String,
    remarks: String,

    // Link to sale
    saleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sale',
    },

    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
receiptSchema.index({ millId: 1, date: -1 });
receiptSchema.index({ partyId: 1, date: -1 });

module.exports = mongoose.model('Receipt', receiptSchema);
```

### 6.2 Payment Model

```javascript
// src/shared/models/payment.model.js
const mongoose = require('mongoose');
const { PAYMENT_MODES } = require('../constants');

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    millId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mill',
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    partyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Party',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount cannot be negative'],
    },
    mode: {
      type: String,
      enum: Object.values(PAYMENT_MODES),
      required: true,
    },
    referenceNumber: String,
    chequeNumber: String,
    chequeDate: Date,
    bankName: String,
    remarks: String,

    // Link to purchase
    purchaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Purchase',
    },

    createdById: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
paymentSchema.index({ millId: 1, date: -1 });
paymentSchema.index({ partyId: 1, date: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
```

---

## 7. Database Connection

```javascript
// src/shared/database/connection.js
const mongoose = require('mongoose');
const config = require('../../config');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4, // Use IPv4
    };

    await mongoose.connect(config.database.uri, options);

    logger.info('✅ MongoDB connected successfully');

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });
  } catch (error) {
    logger.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 8. Indexing Strategy

### Performance Indexes

| Model          | Index Fields                           | Purpose                |
| -------------- | -------------------------------------- | ---------------------- |
| User           | `{ email: 1 }`                         | Fast login lookups     |
| User           | `{ millId: 1 }`                        | Filter by mill         |
| RefreshToken   | `{ token: 1 }`                         | Token validation       |
| RefreshToken   | `{ expiresAt: 1 }` (TTL)               | Auto-delete expired    |
| Mill           | `{ code: 1 }`                          | Unique mill code       |
| Purchase       | `{ millId: 1, date: -1 }`              | Recent purchases       |
| Sale           | `{ millId: 1, date: -1 }`              | Recent sales           |
| Stock          | `{ millId: 1, stockType: 1 }` (unique) | Stock lookup           |
| Attendance     | `{ millId: 1, staffId: 1, date: 1 }`   | Daily attendance check |

---

## Next Steps

Continue to:
- [Part 3: Authentication & Security](./implementation-part-3-auth-security.md) - Passport.js and JWT implementation
- [Part 4: API Modules](./implementation-part-4-api-modules.md) - API endpoints and controllers
