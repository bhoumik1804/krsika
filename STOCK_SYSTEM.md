# Mill Management System - Stock & Daily Reports Documentation

## 1. Overview

The Stock Management System is a centralized, event-driven architecture designed to track all inventory movements across the mill. It ensures accurate, date-wise historical data and real-time stock balances by logging every transaction as a `StockTransaction` record. This system powers the **Stock Overview** and **Daily Report** pages.

## 2. Architecture

### Core Concept

Instead of calculating stock on the fly from various source documents (Paddy Purchase, Rice Sale, etc.), the system maintains a dedicated `StockTransaction` ledger.

- **Source of Truth**: The original document (e.g., `PaddyPurchase`) is the source of the transaction.
- **Shadow Record**: A `StockTransaction` is created/updated/deleted automatically whenever the source document changes.
- **Data Flow**: `Source Document` -> `Service Hook` -> `StockTransactionService` -> `StockTransaction DB`.

### Key Benefits

- **Performance**: fetching current balance is a simple aggregation on one collection.
- **History**: Historical stock levels are trivial to query by date range.
- **Consistency**: Centralized logic strictly enforces CREDIT (in) vs DEBIT (out) rules.

## 3. Database Schema

### StockTransaction Model

**Collection**: `stock_transactions`

| Field       | Type     | Description                                                             |
| :---------- | :------- | :---------------------------------------------------------------------- |
| `millId`    | ObjectId | Reference to the Mill.                                                  |
| `date`      | Date     | Transaction date. crucial for historical reporting.                     |
| `commodity` | String   | e.g., 'Paddy', 'Rice', 'Gunny', 'FRK'.                                  |
| `variety`   | String   | e.g., 'Mota', 'Patla', 'New', 'Old'.                                    |
| `type`      | Enum     | `'CREDIT'` (Stock Increase) or `'DEBIT'` (Stock Decrease).              |
| `action`    | String   | e.g., 'Purchase', 'Sale', 'Inward', 'Outward', 'Production', 'Milling'. |
| `quantity`  | Number   | Quantity in Quintals (Qtl).                                             |
| `bags`      | Number   | Number of bags involved.                                                |
| `refModel`  | String   | Source model name (e.g., 'PaddyPurchase', 'DailyProduction').           |
| `refId`     | ObjectId | ID of the source document using `refModel`.                             |
| `remarks`   | String   | Optional notes.                                                         |

**Indexes**:

- `{ millId: 1, date: -1 }` (History queries)
- `{ millId: 1, commodity: 1, variety: 1 }` (Balance queries)

## 4. Server-Side Implementation

### Services

- **`StockTransactionService`**:
  - `recordTransaction()`: Core logic to save a transaction.
  - `updateTransaction()`: Updates transaction when source record changes.
  - `deleteTransactionsByRef()`: Cleanup when source record is deleted.
  - `getStockByAction()`: **Optimized** aggregation for Daily Reports (groups by commodity).
  - `getStockBalance()`: Aggregates total CREDIT - DEBIT for current stock.

- **`StockHelperService`**:
  - Wrapper functions like `recordInward()`, `recordOutward()`, `recordProduction()` to standardize calls from other services.
  - Automatic unit conversion (Kg -> Qtl) for daily records.

### Hook Integration

The following services automatically trigger stock updates:

- `PaddyPurchaseService` -> `recordTransaction` (CREDIT)
- `RiceSaleService` -> `recordTransaction` (DEBIT)
- `DailyInwardService` -> `recordInward` (CREDIT)
- `DailyOutwardService` -> `recordOutward` (DEBIT)
- `DailyProductionService` -> `recordProduction` (CREDIT)
- `DailyMillingService` -> `recordMilling` (DEBIT)
- `DailyPurchaseDealService` -> `recordTransaction` (CREDIT)
- `DailySalesDealService` -> `recordTransaction` (DEBIT)

### API Endpoints

Base Path: `/api/mills/:millId/stock-transactions`

| Method | Endpoint     | Description                                                                                                        |
| :----- | :----------- | :----------------------------------------------------------------------------------------------------------------- |
| `GET`  | `/by-action` | Returns stock grouped by commodity for a specific `action` (e.g., 'Inward') and date range. Used by Daily Reports. |
| `GET`  | `/balance`   | Returns current stock balance (Credit - Debit). Supports optional `asOfDate` for historical snapshots.             |
| `GET`  | `/summary`   | Returns high-level statistics (total txns, net movement).                                                          |
| `GET`  | `/`          | List all transactions with pagination and filters.                                                                 |

## 5. Client-Side Implementation (Frontend)

### Structure

The frontend stock system is built using React with TypeScript and is comprised of three layers:

1. **API Client Layer**: Typed communicators with the backend.
2. **Hook Layer**: Reusable logic for data fetching and state management.
3. **UI Layer**: Pages and components for data visualization.

### Layer 1: API Client

**File**: `client/src/lib/stock-transaction-api.ts`

This file is the single source of truth for stock-related API interactions.

- **Interfaces**:
  - `StockTransaction`: Full transaction object.
  - `StockBalance`: Aggregated balance object (Credit, Debit, Balance).
  - `StockByAction`: Aggregated object for daily reports (totalQuantity, count).

- **Methods**:
  - `getStockByAction(millId, params)`: Fetches grouped data for daily reports.
  - `getStockBalance(millId, params)`: Fetches current or historical balance.
  - `getStockTransactions(millId, params)`: Fetches raw transaction list.
- **Utilities**:
  - `exportStockDataAsCsv(data, filename)`: Converts report data to CSV and triggers download.
  - `exportStockBalanceAsCsv(data, filename)`: Converts balance data to CSV.

### Layer 2: Custom Hooks

**File**: `client/src/hooks/use-stock-by-action.ts`

To avoid code duplication across the 6 Daily Report pages, we created a reusable hook.

**Usage:**

```typescript
const { data, loading, error, refetch } = useStockByAction({
    millId,
    action: 'Inward', // or 'Outward', 'Production', etc.
    dateRange: { from: ..., to: ... }
})
```

**Features:**

- Automatic re-fetching when `dateRange` or `action` changes.
- Handles date formatting for API (`YYYY-MM-DD`).
- Manages `loading` and `error` states consistently.

### Layer 3: UI Components & Pages

#### Reusable Components

- **`StatsCard`**: (`client/src/components/stats-card.tsx`)
  - Used prominently in all reports to show key metrics (Quantity, Bags).
  - Supports 'trend' indicators (positive/negative/neutral).
- **`DateRangePicker`**:
  - standardized component for selecting date ranges.

#### Page Implementation Details

**1. Stock Overview Page**

- **File**: `client/src/pages/mill-admin/stock/stock-overview/index.tsx`
- **Function**: Dashboard for current stock position.
- **Logic**:
  - Fetches balance via `getStockBalance`.
  - Filters: Supports `asOfDate` (Balance as of X date).
  - Grouping: Maps raw commodities to categories:
    - **Paddy**: All paddy varieties.
    - **Rice**: All rice varieties.
    - **Gunny**: Detailed bag counts (New, Old, Plastic).
    - **By-Products**: Khanda, Kodha, Bran, etc.

**2. Daily Report Pages**

- **Files**: `client/src/pages/mill-admin/daily-reports/*`
- **Variations**:
  - `Inwards`: Action = 'Inward'
  - `Outwards`: Action = 'Outward'
  - `Production`: Action = 'Production'
  - `Milling`: Action = 'Milling'
  - `Purchase Deals`: Action = 'Purchase Deal'
  - `Sales Deals`: Action = 'Sales Deal'
- **Common Layout**:
  - Header with Page Title.
  - Date Range Picker & Export Button.
  - Grid of `StatsCard`s showing quantity per commodity.
  - Empty states and Loading spinners.

## 6. Development Workflow

### Adding a New Stock Movement Type

1. **Backend**: Update `StockTransaction` model `action` enum if needed (it's a string, so flexible).
2. **Backend Service**: In the source service (e.g., `NewFeatureService`), inject `StockTransactionService`.
3. **Backend Hook**: Call `recordTransaction` in `create`, `update`, and `delete` methods of the source service.
4. **Frontend**: Create a new report page using `useStockByAction` with the new action name.

### Debugging Stock Issues

- **Check Database**: Query `stock_transactions` collection directly filtering by `refId` to see if the transaction exists.
- **Check Logs**: Server logs "Stock transaction recorded/updated/deleted" with details.
- **Verify Sums**: Compare `StockTransaction` aggregate with source documents (e.g., sum of all `PaddyPurchase` vs stock `CREDIT` for Paddy).
