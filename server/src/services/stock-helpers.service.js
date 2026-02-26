import logger from '../utils/logger.js'
import * as StockTransactionService from './stock-transaction.service.js'

/**
 * Helper to record stock transaction for Inward entries
 * Inward = Stock increase (CREDIT)
 */
export const recordInwardTransaction = async (millId, entry, userId) => {
    if (!entry.item || !entry.weight) {
        logger.warn(
            'Skipping inward stock recording - missing item or weight',
            {
                millId,
                entryId: entry._id,
                item: entry.item,
                weight: entry.weight,
            }
        )
        return
    }

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
    if (!entry.item || !entry.weight) {
        logger.warn(
            'Skipping outward stock recording - missing item or weight',
            {
                millId,
                entryId: entry._id,
                item: entry.item,
                weight: entry.weight,
            }
        )
        return
    }

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
    if (!entry.itemName || !entry.weight) {
        logger.warn(
            'Skipping production stock recording - missing itemName or weight',
            {
                millId,
                entryId: entry._id,
                itemName: entry.itemName,
                weight: entry.weight,
            }
        )
        return
    }

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
    if (!entry.paddyType || !entry.paddyQuantity) {
        logger.warn(
            'Skipping milling stock recording - missing paddyType or paddyQuantity',
            {
                millId,
                entryId: entry._id,
                paddyType: entry.paddyType,
                paddyQuantity: entry.paddyQuantity,
            }
        )
        return
    }

    // Milling consumes stock (DEBIT)
    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: entry.paddyType,
            variety: entry.paddyType || null,
            type: 'DEBIT',
            action: 'Milling',
            quantity: entry.paddyQuantity, // Already in Qtl
            bags: 0,
            refModel: 'DailyMilling',
            refId: entry._id,
            remarks: `Milled in ${entry.shift || 'shift'}`,
        },
        userId
    )
}

/**
 * Helper to record stock transaction for Milling Paddy entries
 */
export const recordMillingPaddyStock = async (millId, entry, userId) => {
    // 1. DEBIT Paddy (Input)
    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: 'Paddy',
            variety: entry.paddyType || null,
            type: 'DEBIT',
            action: 'Milling',
            quantity: entry.hopperInQintal || 0,
            bags: entry.hopperInGunny || 0,
            refModel: 'MillingPaddy',
            refId: entry._id,
            remarks: `Milling Paddy Input - ${entry.paddyType || ''}`,
        },
        userId
    )

    // 2. CREDIT Outputs (Production)
    const outputs = [
        { name: 'Rice', qty: entry.riceQuantity, variety: entry.riceType },
        { name: 'Khanda', qty: entry.khandaQuantity },
        { name: 'Kodha', qty: entry.kodhaQuantity },
        { name: 'Nakkhi', qty: entry.nakkhiQuantity },
        { name: 'Bhusa', qty: entry.bhusaTon, variety: 'Ton' }, // Bhusa is in Ton in model? Let's check unit
    ]

    for (const output of outputs) {
        if (output.qty > 0) {
            await StockTransactionService.recordTransaction(
                millId,
                {
                    date: entry.date,
                    commodity: output.name,
                    variety: output.variety || null,
                    type: 'CREDIT',
                    action: 'Production',
                    quantity: output.qty,
                    bags: 0,
                    refModel: 'MillingPaddy',
                    refId: entry._id,
                    remarks: `Production from Milling Paddy`,
                },
                userId
            )
        }
    }
}

/**
 * Helper to record stock transaction for Milling Rice entries
 */
export const recordMillingRiceStock = async (millId, entry, userId) => {
    // 1. DEBIT Rice (Input)
    await StockTransactionService.recordTransaction(
        millId,
        {
            date: entry.date,
            commodity: 'Rice',
            variety: entry.riceType || null,
            type: 'DEBIT',
            action: 'Milling',
            quantity: entry.hopperInQintal || 0,
            bags: entry.hopperInGunny || 0,
            refModel: 'MillingRice',
            refId: entry._id,
            remarks: `Milling Rice Input - ${entry.riceType || ''}`,
        },
        userId
    )

    // 2. CREDIT Outputs (Production)
    const outputs = [
        { name: 'Rice', qty: entry.riceQuantity, variety: entry.riceType },
        { name: 'Khanda', qty: entry.khandaQuantity },
        { name: 'Silky Kodha', qty: entry.silkyKodhaQuantity },
    ]

    for (const output of outputs) {
        if (output.qty > 0) {
            await StockTransactionService.recordTransaction(
                millId,
                {
                    date: entry.date,
                    commodity: output.name,
                    variety: output.variety || null,
                    type: 'CREDIT',
                    action: 'Production',
                    quantity: output.qty,
                    bags: 0,
                    refModel: 'MillingRice',
                    refId: entry._id,
                    remarks: `Production from Milling Rice`,
                },
                userId
            )
        }
    }
}

/**
 * central helper for milling update - deletes all and recreates
 */
export const updateMillingStock = async (
    refModel,
    refId,
    millId,
    entry,
    userId
) => {
    await StockTransactionService.deleteTransactionsByRef(refModel, refId)
    if (refModel === 'MillingPaddy') {
        await recordMillingPaddyStock(millId, entry, userId)
    } else if (refModel === 'MillingRice') {
        await recordMillingRiceStock(millId, entry, userId)
    }
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
        updates.commodity = entry.paddyType
        updates.variety = entry.paddyType || null
        updates.quantity = entry.paddyQuantity
        updates.bags = 0
        updates.remarks = `Milled in ${entry.shift || 'shift'}`
    }

    await StockTransactionService.updateTransaction(refModel, refId, updates)
}

/**
 * Delete stock transaction helper
 */
export const deleteStockTransaction = async (refModel, refId) => {
    await StockTransactionService.deleteTransactionsByRef(refModel, refId)
}
