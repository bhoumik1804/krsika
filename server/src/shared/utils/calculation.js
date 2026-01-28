/**
 * Calculation utility functions
 * Rice mill specific calculations for stock, pricing, and conversions
 */

/**
 * Calculate price per quintal from total price and weight
 * @param {Number} totalPrice - Total price
 * @param {Number} weightInQuintals - Weight in quintals
 * @returns {Number} Price per quintal
 */
export const calculatePricePerQuintal = (totalPrice, weightInQuintals) => {
    if (!weightInQuintals || weightInQuintals === 0) return 0
    return Math.round((totalPrice / weightInQuintals) * 100) / 100
}

/**
 * Calculate total price from price per quintal and weight
 * @param {Number} pricePerQuintal - Price per quintal
 * @param {Number} weightInQuintals - Weight in quintals
 * @returns {Number} Total price
 */
export const calculateTotalPrice = (pricePerQuintal, weightInQuintals) => {
    return Math.round(pricePerQuintal * weightInQuintals * 100) / 100
}

/**
 * Convert quintals to kilograms
 * @param {Number} quintals - Weight in quintals
 * @returns {Number} Weight in kilograms
 */
export const quintalsToKg = (quintals) => {
    return quintals * 100
}

/**
 * Convert kilograms to quintals
 * @param {Number} kg - Weight in kilograms
 * @returns {Number} Weight in quintals
 */
export const kgToQuintals = (kg) => {
    return kg / 100
}

/**
 * Convert quintals to tons
 * @param {Number} quintals - Weight in quintals
 * @returns {Number} Weight in tons
 */
export const quintalsToTons = (quintals) => {
    return quintals / 10
}

/**
 * Convert tons to quintals
 * @param {Number} tons - Weight in tons
 * @returns {Number} Weight in quintals
 */
export const tonsToQuintals = (tons) => {
    return tons * 10
}

/**
 * Calculate rice output from paddy (considering milling ratio)
 * Standard ratio: 1 quintal paddy = 0.67 quintal rice (67%)
 * @param {Number} paddyWeight - Paddy weight in quintals
 * @param {Number} millingRatio - Milling ratio (default 0.67)
 * @returns {Number} Rice output in quintals
 */
export const calculateRiceOutput = (paddyWeight, millingRatio = 0.67) => {
    return Math.round(paddyWeight * millingRatio * 100) / 100
}

/**
 * Calculate broken rice percentage
 * @param {Number} brokenRice - Broken rice weight
 * @param {Number} totalRice - Total rice weight
 * @returns {Number} Broken rice percentage
 */
export const calculateBrokenPercentage = (brokenRice, totalRice) => {
    if (!totalRice || totalRice === 0) return 0
    return Math.round((brokenRice / totalRice) * 100 * 100) / 100
}

/**
 * Calculate GST amount
 * @param {Number} amount - Base amount
 * @param {Number} gstRate - GST rate (e.g., 5, 12, 18)
 * @returns {Object} GST breakdown
 */
export const calculateGST = (amount, gstRate = 0) => {
    const gstAmount = Math.round((amount * gstRate) / 100)
    const totalAmount = amount + gstAmount

    return {
        baseAmount: amount,
        gstRate,
        gstAmount,
        totalAmount,
    }
}

/**
 * Calculate amount with GST included
 * @param {Number} totalAmount - Total amount including GST
 * @param {Number} gstRate - GST rate
 * @returns {Object} Amount breakdown
 */
export const reverseGST = (totalAmount, gstRate = 0) => {
    const baseAmount = Math.round((totalAmount * 100) / (100 + gstRate))
    const gstAmount = totalAmount - baseAmount

    return {
        baseAmount,
        gstRate,
        gstAmount,
        totalAmount,
    }
}

/**
 * Calculate average price
 * @param {Array} prices - Array of price objects with {price, weight}
 * @returns {Number} Average price per quintal
 */
export const calculateAveragePrice = (prices) => {
    if (!prices || prices.length === 0) return 0

    const totalWeight = prices.reduce((sum, item) => sum + item.weight, 0)
    const totalValue = prices.reduce(
        (sum, item) => sum + item.price * item.weight,
        0
    )

    if (totalWeight === 0) return 0
    return Math.round((totalValue / totalWeight) * 100) / 100
}

/**
 * Calculate profit/loss
 * @param {Number} sellingPrice - Selling price
 * @param {Number} costPrice - Cost price
 * @returns {Object} Profit/loss details
 */
export const calculateProfitLoss = (sellingPrice, costPrice) => {
    const difference = sellingPrice - costPrice
    const percentage = costPrice !== 0 ? (difference / costPrice) * 100 : 0

    return {
        amount: Math.round(difference * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        isProfit: difference >= 0,
    }
}

/**
 * Calculate weighted average
 * @param {Array} items - Array of {value, weight}
 * @returns {Number} Weighted average
 */
export const calculateWeightedAverage = (items) => {
    if (!items || items.length === 0) return 0

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    const weightedSum = items.reduce(
        (sum, item) => sum + item.value * item.weight,
        0
    )

    if (totalWeight === 0) return 0
    return Math.round((weightedSum / totalWeight) * 100) / 100
}

/**
 * Round to 2 decimal places
 * @param {Number} num - Number to round
 * @returns {Number} Rounded number
 */
export const roundTo2Decimals = (num) => {
    return Math.round(num * 100) / 100
}

/**
 * Round to nearest integer
 * @param {Number} num - Number to round
 * @returns {Number} Rounded number
 */
export const roundToNearest = (num) => {
    return Math.round(num)
}

/**
 * Calculate percentage
 * @param {Number} value - Part value
 * @param {Number} total - Total value
 * @returns {Number} Percentage
 */
export const calculatePercentage = (value, total) => {
    if (!total || total === 0) return 0
    return Math.round((value / total) * 100 * 100) / 100
}

/**
 * Format Indian currency
 * @param {Number} amount - Amount to format
 * @returns {String} Formatted currency
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
    }).format(amount)
}

/**
 * Format weight with unit
 * @param {Number} weight - Weight in quintals
 * @param {String} unit - Unit (quintal/kg/ton)
 * @returns {String} Formatted weight
 */
export const formatWeight = (weight, unit = 'quintal') => {
    const value = Math.round(weight * 100) / 100
    return `${value} ${unit}${value !== 1 ? 's' : ''}`
}

export default {
    calculatePricePerQuintal,
    calculateTotalPrice,
    quintalsToKg,
    kgToQuintals,
    quintalsToTons,
    tonsToQuintals,
    calculateRiceOutput,
    calculateBrokenPercentage,
    calculateGST,
    reverseGST,
    calculateAveragePrice,
    calculateProfitLoss,
    calculateWeightedAverage,
    roundTo2Decimals,
    roundToNearest,
    calculatePercentage,
    formatCurrency,
    formatWeight,
}
