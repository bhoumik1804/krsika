import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Labour Milling Schema
 * Tracks labour milling entries for a mill
 */
const LabourMillingSchema = new Schema(
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
        hopperInGunny: {
            type: Number,
            min: 0,
        },
        hopperRate: {
            type: Number,
            min: 0,
        },
        labourGroupName: {
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
    }
)

// Compound indexes for common queries
LabourMillingSchema.index({ millId: 1, date: -1 })
LabourMillingSchema.index({ millId: 1, labourGroupName: 1 })

// Virtual for formatted date
LabourMillingSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
LabourMillingSchema.set('toJSON', { virtuals: true })
LabourMillingSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
LabourMillingSchema.plugin(aggregatePaginate)

export const LabourMilling = model('LabourMilling', LabourMillingSchema)
