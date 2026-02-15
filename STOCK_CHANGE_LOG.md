# Server Stock History Optimization - Walkthrough

## Summary

Implemented a comprehensive stock history tracking system for the mill management system. The system now automatically records all stock movements (purchases, sales, inward, outward, production, and milling) in a centralized model, enabling accurate date-wise historical queries and reports.

## Changes Made

### New Model: StockTransaction

Created [`stock-transaction.model.js`](server/src/models/stock-transaction.model.js) - a centralized model for tracking ALL stock movements.

**Key Fields:**

- `commodity`: Paddy, Rice, FRK, Gunny, Khanda, etc.
- `variety`: Mota, Patla, New, Old, etc.
- `type`: CREDIT (increase) or DEBIT (decrease)
- `action`: Purchase, Sale, Inward, Outward, Production, Milling
- `quantity`: in Quintals (Qtl)
- `refModel` & `refId`: Links to source entry

**Optimized Indexing:**

```javascript
// Compound indexes for fast history retrieval
{ millId: 1, date: -1 }
{ millId: 1, commodity: 1, date: -1 }
{ millId: 1, commodity: 1, variety: 1, date: -1 }
```

---

### New Service: Stock Transaction

Created [`stock-transaction.service.js`](server/src/services/stock-transaction.service.js) with comprehensive methods:

- `recordTransaction()`: Central method to log stock movements
- `updateTransaction()`: Update when source entry changes
- `deleteTransactionsByRef()`: Cleanup when entry deleted
- `getStockBalance()`: Calculate current stock levels
- `getStockTransactionSummary()`: Date-range analytics

---

### New Helpers: Stock Helpers

Created [`stock-helpers.service.js`](server/src/services/stock-helpers.service.js) for consistent integration:

- `recordInwardTransaction()`: Logs CREDIT for inward entries
- `recordOutwardTransaction()`: Logs DEBIT for outward entries
- `recordProductionTransaction()`: Logs CREDIT for produced items
- `recordMillingTransaction()`: Logs DEBIT for milled materials
- `updateStockTransaction()`: Updates based on model type
- `deleteStockTransaction()`: Removes by reference

---

### Integrated Services

Modified the following services to automatically track stock:

#### Purchase & Sale Services

**[paddy-purchase.service.js](server/src/services/paddy-purchase.service.js)**

- ✅ `create`: Records CREDIT transaction
- ✅ `update`: Updates transaction if qty/type changes
- ✅ `delete`: Removes transaction

**[rice-sale.service.js](server/src/services/rice-sale.service.js)**

- ✅ `create`: Records DEBIT transaction
- ✅ `update`: Updates transaction if qty/type changes
- ✅ `delete`: Removes transaction

#### Daily Record Services

**[daily-inward.service.js](server/src/services/daily-inward.service.js)**

- ✅ Tracks inward stock (CREDIT)
- ✅ Converts Kg to Qtl automatically

**[daily-outward.service.js](server/src/services/daily-outward.service.js)**

- ✅ Tracks outward stock (DEBIT)
- ✅ Converts Kg to Qtl automatically

**[daily-production.service.js](server/src/services/daily-production.service.js)**

- ✅ Tracks produced items (CREDIT)
- ✅ Stores warehouse and stack info

**[daily-milling.service.js](server/src/services/daily-milling.service.js)**

- ✅ Tracks milled materials (DEBIT)
- ✅ Records mill number for reference

### Deal Services

Integrated `daily-purchase-deal.service.js` and `daily-sales-deal.service.js`:

- ✅ `Purchase Deal`: Records CREDIT transaction (stock increase)
- ✅ `Sales Deal`: Records DEBIT transaction (stock decrease)
- ✅ Auto-updates stock when deals are modified

---

## Frontend Integration

### Optimized API

- **`getStockByAction`**: New server-side aggregation endpoint for efficient reporting.
- **`getStockBalance`**: Updated to support historical date filtering (`asOfDate`).
- **`stock-transaction-api.ts`**: Unified client with type safety and CSV export.

### Daily Report Pages

Rewrote all 6 daily report pages to use real data:

- **Inwards, Outwards, Production, Milling, Purchase Deals, Sales Deals**
- Features:
  - Date-range filtering
  - Live data fetching via `useStockByAction` hook
  - Excel/CSV Export
  - Loading & Empty states

### Stock Overview Page

- Completely integrated with `StockTransaction` API
- Displays accurate `Balance` (Credit - Debit)
- Categorized view (Paddy, Rice, Gunny, By-Products)
- Date-range filtering for historical balance
- Export functionality

---

## Benefits

### 1. Date-Wise History

Query stock movements for any date range:

```javascript
const history = await StockTransactionService.getStockTransactionList(millId, {
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  commodity: "Paddy",
});
```

### 2. Accurate Stock Balance

Calculate current stock levels by commodity/variety:

```javascript
const balances = await StockTransactionService.getStockBalance(millId);
// Returns: [{ commodity: 'Paddy', variety: 'Mota', balance: 150.50, ... }]
```

### 3. Transaction Audit Trail

Every stock change links to its source:

- `refModel`: 'PaddyPurchase', 'RiceSale', 'DailyInward', etc.
- `refId`: Original document ID
- `createdBy`: Who made the change

### 4. Automated Tracking

No manual intervention needed - stock updates automatically on:

- Purchase creation
- Sale creation
- Daily inward/outward entries
- Production records
- Milling operations
- Purchase/Sales deals

---

## Technical Notes

### Quantity Units

- Daily records store weight in **Kg**
- Stock transactions convert to **Qtl** (1 Qtl = 100 Kg)
- Ensures consistency across the system

### Transaction Types

- **CREDIT**: Stock increase (Purchase, Inward, Production output)
- **DEBIT**: Stock decrease (Sale, Outward, Production input, Milling)

### Error Handling

All services wrap stock operations with proper error handling to ensure transactional integrity of the main operations.
