import mongoose from 'mongoose'
import { STAFF_ROLES } from '../constants/roles.js'

const staffSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null, // Optional: link to user account
        },
        name: {
            type: String,
            required: [true, 'Staff name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: Object.values(STAFF_ROLES),
            required: [true, 'Staff role is required'],
        },
        salary: {
            type: Number,
            required: [true, 'Salary is required'],
            min: [0, 'Salary cannot be negative'],
        },
        joiningDate: {
            type: Date,
            required: [true, 'Joining date is required'],
        },
        address: {
            type: String,
        },
        aadharNumber: {
            type: String,
            match: [/^\d{12}$/, 'Aadhar must be 12 digits'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes
staffSchema.index({ millId: 1, isActive: 1 })
staffSchema.index({ millId: 1, role: 1 })

const Staff = mongoose.model('Staff', staffSchema)

export default Staff
