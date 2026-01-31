import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Daily Production Schema
 * Tracks daily production entries for a mill
 */
const DailyProductionSchema = new Schema(
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
        itemName: {
            type: String,
            required: true,
            trim: true,
        },
        itemType: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        bags: {
            type: Number,
            required: true,
            min: 0,
        },
        weight: {
            type: Number,
            required: true,
            min: 0,
            comment: 'Weight in Kilograms (Kg)',
        },
        warehouse: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        stackNumber: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'stocked', 'rejected'],
            default: 'pending',
            index: true,
        },
        remarks: {
            type: String,
            trim: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_, ret) => {
                ret.id = ret._id
                delete ret.__v
                return ret
            },
        },
    }
)

// Compound indexes for common queries
DailyProductionSchema.index({ millId: 1, date: -1 })
DailyProductionSchema.index({ millId: 1, status: 1 })
DailyProductionSchema.index({ millId: 1, itemType: 1 })
DailyProductionSchema.index({ millId: 1, warehouse: 1 })
DailyProductionSchema.index({ millId: 1, date: -1, status: 1 })

// Add aggregate pagination plugin
DailyProductionSchema.plugin(aggregatePaginate)

export const DailyProduction = model('DailyProduction', DailyProductionSchema)
