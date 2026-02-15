import * as StockTransactionService from './stock-transaction.service.js'

/**
 * Helper to record stock transaction for Inward entries
 * Inward = Stock increase (CREDIT)
 */
export const recordInwardTransaction = async (millId, entry, userId) => {
    if (!entry.item || !entry.weight) return

    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: entry.item, // e.g. Paddy, Rice, Gunny, etc.
            variety: entry.itemType || null,
            type: 'CREDIT',
            action: 'Inward',
            quantity: entry.weight / 100, // Convert Kg to Qtl
            bags: entry.bags || 0,
            refModel: 'DailyInward',
            refId: entry._id,
            remarks: `Inward from ${entry.partyName || 'Party'}`,
        },
        userId
    )
}

/**
 * Helper to record stock transaction for Outward entries
 * Outward = Stock decrease (DEBIT)
 */
export const recordOutwardTransaction = async (millId, entry, userId) => {
    if (!entry.item || !entry.weight) return

    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: entry.item, // e.g. Paddy, Rice, Gunny, FRK, etc.
            variety: entry.itemType || null,
            type: 'DEBIT',
            action: 'Outward',
            quantity: entry.weight / 100, // Convert Kg to Qtl
            bags: entry.bags || 0,
            refModel: 'DailyOutward',
            refId: entry._id,
            remarks: `Outward to ${entry.partyName || 'Party'}`,
        },
        userId
    )
}

/**
 * Helper to record stock transaction for Production entries
 * Production creates multiple transactions:
 * - DEBIT for input (consumed raw materials)
 * - CREDIT for output (produced items)
 */
export const recordProductionTransaction = async (millId, entry, userId) => {
    if (!entry.itemName || !entry.weight) return

    // Production creates new stock (CREDIT)
    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: entry.itemName,
            variety: entry.itemType || null,
            type: 'CREDIT',
            action: 'Production',
            quantity: entry.weight / 100, // Convert Kg to Qtl
            bags: entry.bags || 0,
            refModel: 'DailyProduction',
            refId: entry._id,
            remarks: `Produced in ${entry.warehouse || 'warehouse'}`,
        },
        userId
    )
}

/**
 * Helper to record stock transaction for Milling entries
 * Milling consumes stock (DEBIT)
 */
export const recordMillingTransaction = async (millId, entry, userId) => {
    if (!entry.itemType || !entry.quantity) return

    // Milling consumes stock (DEBIT)
    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: entry.itemType,
            variety: entry.variety || null,
            type: 'DEBIT',
            action: 'Milling',
            quantity: entry.quantity, // Already in Qtl
            bags: entry.bags || 0,
            refModel: 'DailyMilling',
            refId: entry._id,
            remarks: `Milled in ${entry.millNumber || 'mill'}`,
        },
        userId
    )
}

/**
 * Update stock transaction helper
 */
export const updateStockTransaction = async (refModel, refId, entry) => {
    const updates = {
        date: entry.date,
    }

    // Add fields based on model type
    if (refModel === 'DailyInward' || refModel === 'DailyOutward') {
        updates.commodity = entry.item
        updates.variety = entry.itemType || null
        updates.quantity = entry.weight / 100
        updates.bags = entry.bags || 0
        updates.remarks = `${refModel === 'DailyInward' ? 'Inward from' : 'Outward to'} ${entry.partyName || 'Party'}`
    } else if (refModel === 'DailyProduction') {
        updates.commodity = entry.itemName
        updates.variety = entry.itemType || null
        updates.quantity = entry.weight / 100
        updates.bags = entry.bags || 0
        updates.remarks = `Produced in ${entry.warehouse || 'warehouse'}`
    } else if (refModel === 'DailyMilling') {
        updates.commodity = entry.itemType
        updates.variety = entry.variety || null
        updates.quantity = entry.quantity
        updates.bags = entry.bags || 0
        updates.remarks = `Milled in ${entry.millNumber || 'mill'}`
    }

    await StockTransactionService.updateTransaction(refModel, refId, updates)
}

/**
 * Delete stock transaction helper
 */
export const deleteStockTransaction = async (refModel, refId) => {
    await StockTransactionService.deleteTransactionsByRef(refModel, refId)
}
