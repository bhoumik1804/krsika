import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Labour Other Schema
 * Tracks other labour entries for a mill
 */
const LabourOtherSchema = new Schema(
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
        labourType: {
            type: String,
            trim: true,
        },
        labourGroupName: {
            type: String,
            trim: true,
        },
        numberOfGunny: {
            type: Number,
            min: 0,
        },
        labourRate: {
            type: Number,
            min: 0,
        },
        workDetail: {
            type: String,
            trim: true,
        },
        totalPrice: {
            type: Number,
            min: 0,
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
LabourOtherSchema.index({ millId: 1, date: -1 })
LabourOtherSchema.index({ millId: 1, labourGroupName: 1 })
LabourOtherSchema.index({ millId: 1, labourType: 1 })

// Virtual for formatted date
LabourOtherSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
LabourOtherSchema.set('toJSON', { virtuals: true })
LabourOtherSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
LabourOtherSchema.plugin(aggregatePaginate)

export const LabourOther = model('LabourOther', LabourOtherSchema)
