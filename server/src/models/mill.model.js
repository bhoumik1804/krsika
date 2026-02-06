import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { MILL_STATUS } from '../constants/mill.status.enum.js'

const MillSchema = new Schema(
    {
        millName: { type: String, required: true },
        millInfo: {
            gstNumber: { type: String },
            panNumber: { type: String }, // pan card number (Business / Company)
            mnmNumber: { type: String },
        },
        contact: {
            email: {
                type: String,
                required: true,
                lowercase: true,
                trim: true,
            },
            phone: { type: String, required: true },
            address: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
        },
        // Flattened status fields for quick middleware checks
        status: {
            type: String,
            enum: Object.values(MILL_STATUS),
            default: MILL_STATUS.PENDING_VERIFICATION,
        },
    },
    { timestamps: true }
)

MillSchema.plugin(aggregatePaginate)

export const Mill = model('Mill', MillSchema)
