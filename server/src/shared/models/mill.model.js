import mongoose from 'mongoose'
import { MILL_STATUS } from '../constants/misc-types.js'

const millSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Mill name is required'],
            trim: true,
        },
        code: {
            type: String,
            required: [true, 'Mill code is required'],
            unique: true,
            uppercase: true,
            trim: true,
            match: [
                /^[A-Z0-9]{3,10}$/,
                'Mill code must be 3-10 uppercase alphanumeric characters',
            ],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        city: {
            type: String,
            required: [true, 'City is required'],
        },
        state: {
            type: String,
            required: [true, 'State is required'],
        },
        pincode: {
            type: String,
            required: [true, 'Pincode is required'],
            match: [/^\d{6}$/, 'Pincode must be 6 digits'],
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
        gstNumber: {
            type: String,
            uppercase: true,
            trim: true,
            sparse: true,
            match: [
                /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
                'Invalid GST number format',
            ],
        },
        panNumber: {
            type: String,
            uppercase: true,
            trim: true,
            sparse: true,
            match: [/^[A-Z]{5}\d{4}[A-Z]{1}$/, 'Invalid PAN number format'],
        },
        status: {
            type: String,
            enum: Object.values(MILL_STATUS),
            default: MILL_STATUS.ACTIVE,
        },
        logo: {
            type: String,
            default: null,
        },
        settings: {
            type: Map,
            of: mongoose.Schema.Types.Mixed,
            default: new Map(),
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Indexes (code index is already created by unique: true)
millSchema.index({ ownerId: 1 })
millSchema.index({ status: 1 })

// Instance method to check if mill is active
millSchema.methods.isActive = function () {
    return this.status === MILL_STATUS.ACTIVE
}

// Instance method to get full address
millSchema.methods.getFullAddress = function () {
    return `${this.address}, ${this.city}, ${this.state} - ${this.pincode}`
}

const Mill = mongoose.model('Mill', millSchema)

export default Mill
