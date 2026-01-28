import mongoose from 'mongoose'
import { STOCK_TYPE } from '../constants/stock-types.js'

const stockSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        stockType: {
            type: String,
            enum: Object.values(STOCK_TYPE),
            required: [true, 'Stock type is required'],
        },
        variety: {
            type: String,
            trim: true,
            default: 'General',
        },

        // Opening stock
        openingStock: {
            type: Number,
            default: 0,
            min: [0, 'Opening stock cannot be negative'],
        },

        // Current stock
        currentStock: {
            type: Number,
            default: 0,
        },

        // Number of bags
        bags: {
            type: Number,
            default: 0,
            min: [0, 'Bags cannot be negative'],
        },

        // Minimum stock alert level
        minStockLevel: {
            type: Number,
            default: 10,
            min: [0, 'Min stock level cannot be negative'],
        },

        // Last updated by
        lastUpdatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
)

// Compound unique index - one stock record per mill, stockType, and variety
stockSchema.index({ millId: 1, stockType: 1, variety: 1 }, { unique: true })

// Instance method to check if stock is low
stockSchema.methods.isLowStock = function () {
    return this.currentStock < this.minStockLevel
}

// Instance method to add stock
stockSchema.methods.addStock = async function (quantity, bags = 0) {
    this.currentStock += quantity
    this.bags += bags
    return await this.save()
}

// Instance method to reduce stock
stockSchema.methods.reduceStock = async function (quantity, bags = 0) {
    if (this.currentStock < quantity) {
        throw new Error('Insufficient stock')
    }
    this.currentStock -= quantity
    this.bags = Math.max(0, this.bags - bags)
    return await this.save()
}

// Static method to get or create stock
stockSchema.statics.getOrCreate = async function (
    millId,
    stockType,
    variety = 'General'
) {
    let stock = await this.findOne({ millId, stockType, variety })

    if (!stock) {
        stock = await this.create({
            millId,
            stockType,
            variety,
            currentStock: 0,
            bags: 0,
        })
    }

    return stock
}

const Stock = mongoose.model('Stock', stockSchema)

export default Stock
