import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Labour Group Schema
 * Tracks labour groups for a mill
 */
const LabourGroupSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        groupName: {
            type: String,
            required: true,
            trim: true,
        },
        leaderName: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        memberCount: {
            type: Number,
            min: 0,
            default: 0,
        },
        workType: {
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
LabourGroupSchema.index({ millId: 1, groupName: 1 })

// Ensure virtuals are included in JSON output
LabourGroupSchema.set('toJSON', { virtuals: true })
LabourGroupSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
LabourGroupSchema.plugin(aggregatePaginate)

export const LabourGroup = model('LabourGroup', LabourGroupSchema)
