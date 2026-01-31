import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Staff Report Schema
 * Tracks staff reports for a mill (separate from Staff model for attendance)
 */
const StaffReportSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        staffName: {
            type: String,
            required: true,
            trim: true,
        },
        designation: {
            type: String,
            trim: true,
        },
        department: {
            type: String,
            trim: true,
        },
        phone: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        joiningDate: {
            type: Date,
        },
        salary: {
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
StaffReportSchema.index({ millId: 1, staffName: 1 })

// Ensure virtuals are included in JSON output
StaffReportSchema.set('toJSON', { virtuals: true })
StaffReportSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
StaffReportSchema.plugin(aggregatePaginate)

export const StaffReport = model('StaffReport', StaffReportSchema)
