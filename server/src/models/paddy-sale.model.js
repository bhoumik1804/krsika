import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { dealNumberPlugin } from '../utils/dealNumberPlugin.js'

/**
 * Paddy Sale Schema
 * Tracks paddy sale entries for a mill
 */
const PaddySaleSchema = new Schema(
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
        saleType: {
            type: String,
            trim: true,
            required: true, // e.g., 'DO बिक्री' or 'अन्य'
        },
        // DO specific fields
        doNumber: {
            type: String,
            trim: true,
        },
        // Paddy varieties
        dhanMotaQty: {
            type: Number,
            min: 0,
            default: 0,
        },
        dhanPatlaQty: {
            type: Number,
            min: 0,
            default: 0,
        },
        dhanSarnaQty: {
            type: Number,
            min: 0,
            default: 0,
        },
        // General Paddy fields
        dhanType: {
            type: String,
            trim: true,
        },
        dhanQty: {
            type: Number,
            min: 0,
            default: 0,
        },
        paddyRatePerQuintal: {
            type: Number,
            min: 0,
            default: 0,
        },
        deliveryType: {
            type: String,
            trim: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        discountPercent: {
            type: Number,
            min: 0,
            max: 100,
            default: 0,
        },
        brokerage: {
            type: Number,
            min: 0,
            default: 0,
        },
        // Gunny fields
        gunnyOption: {
            type: String,
            trim: true,
        },
        newGunnyRate: {
            type: Number,
            min: 0,
            default: 0,
        },
        oldGunnyRate: {
            type: Number,
            min: 0,
            default: 0,
        },
        plasticGunnyRate: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

// Indexes for common queries
PaddySaleSchema.index({ millId: 1, date: -1 })
PaddySaleSchema.index({ millId: 1, partyName: 1 })
PaddySaleSchema.index({ millId: 1, brokerName: 1 })
PaddySaleSchema.index({ millId: 1, saleType: 1 })
PaddySaleSchema.index({ millId: 1, doNumber: 1 })
PaddySaleSchema.index({ millId: 1, createdAt: -1 })

// Apply deal number plugin (auto-generates paddySalesDealNumber)
PaddySaleSchema.plugin(dealNumberPlugin, {
    fieldName: 'paddySalesDealNumber',
    prefix: 'PDS',
})

// Apply aggregate paginate plugin
PaddySaleSchema.plugin(aggregatePaginate)

export const PaddySale = model('PaddySale', PaddySaleSchema)
