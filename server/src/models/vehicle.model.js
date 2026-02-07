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
        truckNo: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
)

// Ensure virtuals are included in JSON output
VehicleSchema.set('toJSON', { virtuals: true })
VehicleSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
VehicleSchema.plugin(aggregatePaginate)

export const Vehicle = model('Vehicle', VehicleSchema)
