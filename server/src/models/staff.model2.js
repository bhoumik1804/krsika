import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Attendance Record Sub-Schema
 * Tracks daily attendance status for a staff member
 */
const AttendanceRecordSchema = new Schema(
    {
        date: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['P', 'A', 'H'], // Present, Absent, Holiday
            required: true,
        },
    },
    { _id: false }
)

/**
 * Staff Schema
 * Tracks staff members for a mill
 */
const StaffSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active',
            index: true,
        },
        role: {
            type: String,
            enum: ['manager', 'supervisor', 'operator', 'accountant'],
            required: true,
            index: true,
        },
        attendanceHistory: {
            type: [AttendanceRecordSchema],
            default: [],
        },
        isPaymentDone: {
            type: Boolean,
            default: false,
        },
        isMillVerified: {
            type: Boolean,
            default: false,
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
StaffSchema.index({ millId: 1, email: 1 }, { unique: true })
StaffSchema.index({ millId: 1, status: 1 })
StaffSchema.index({ millId: 1, role: 1 })
StaffSchema.index({ millId: 1, firstName: 1, lastName: 1 })
StaffSchema.index({ millId: 1, 'attendanceHistory.date': 1 })

// Virtual for full name
StaffSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
})

// Ensure virtuals are included in JSON output
StaffSchema.set('toJSON', { virtuals: true })
StaffSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
StaffSchema.plugin(aggregatePaginate)

export const Staff = model('Staff', StaffSchema)
