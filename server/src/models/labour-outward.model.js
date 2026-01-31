import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Labour Outward Schema
 * Tracks labour outward entries for a mill
 */
const LabourOutwardSchema = new Schema(
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
        outwardType: {
            type: String,
            trim: true,
        },
        truckNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        totalGunny: {
            type: Number,
            min: 0,
        },
        numberOfGunnyBundle: {
            type: Number,
            min: 0,
        },
        loadingRate: {
            type: Number,
            min: 0,
        },
        dhulaiRate: {
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
LabourOutwardSchema.index({ millId: 1, date: -1 })
LabourOutwardSchema.index({ millId: 1, labourGroupName: 1 })

// Virtual for formatted date
LabourOutwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
LabourOutwardSchema.set('toJSON', { virtuals: true })
LabourOutwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
LabourOutwardSchema.plugin(aggregatePaginate)

export const LabourOutward = model('LabourOutward', LabourOutwardSchema)
