import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Labour Inward Schema
 * Tracks labour inward entries for a mill
 */
const LabourInwardSchema = new Schema(
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
        inwardType: {
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
        unloadingRate: {
            type: Number,
            min: 0,
        },
        stackingRate: {
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
LabourInwardSchema.index({ millId: 1, date: -1 })
LabourInwardSchema.index({ millId: 1, labourGroupName: 1 })

// Virtual for formatted date
LabourInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
LabourInwardSchema.set('toJSON', { virtuals: true })
LabourInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
LabourInwardSchema.plugin(aggregatePaginate)

export const LabourInward = model('LabourInward', LabourInwardSchema)
