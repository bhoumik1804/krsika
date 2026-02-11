import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * Khanda Sale Schema
 * Tracks khanda sale entries for a mill
 */
const KhandaSaleSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        khandaQty: {
            type: Number,
            min: 0,
        },
        khandaRate: {
            type: Number,
            min: 0,
        },
        discountPercent: {
            type: Number,
            min: 0,
            max: 100,
        },
        brokeragePerQuintal: {
            type: Number,
            min: 0,
        },
    },
    {
        timestamps: true,
    }
)

// Compound indexes for common queries
KhandaSaleSchema.index({ millId: 1, date: -1 })
KhandaSaleSchema.index({ millId: 1, partyName: 1 })
KhandaSaleSchema.index({ millId: 1, brokerName: 1 })

// Virtual for formatted date
KhandaSaleSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
KhandaSaleSchema.set('toJSON', { virtuals: true })
KhandaSaleSchema.set('toObject', { virtuals: true })

// Apply deal number plugin (auto-generates khandaSalesDealNumber)
KhandaSaleSchema.plugin(dealNumberPlugin, {
    fieldName: 'khandaSalesDealNumber',
    prefix: 'KDS',
})

// Add aggregate paginate plugin
KhandaSaleSchema.plugin(aggregatePaginate)

export const KhandaSale = model('KhandaSale', KhandaSaleSchema)
