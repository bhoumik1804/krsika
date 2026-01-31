import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Vehicle Schema
 * Tracks vehicles for a mill
 */
const VehicleSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        vehicleNumber: {
            type: String,
            required: true,
            trim: true,
        },
        vehicleType: {
            type: String,
            trim: true,
        },
        transporterName: {
            type: String,
            trim: true,
        },
        driverName: {
            type: String,
            trim: true,
        },
        driverPhone: {
            type: String,
            trim: true,
        },
        capacity: {
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
VehicleSchema.index({ millId: 1, vehicleNumber: 1 })

// Ensure virtuals are included in JSON output
VehicleSchema.set('toJSON', { virtuals: true })
VehicleSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
VehicleSchema.plugin(aggregatePaginate)

export const Vehicle = model('Vehicle', VehicleSchema)
