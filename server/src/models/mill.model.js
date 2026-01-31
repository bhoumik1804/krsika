import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'
import { MILL_STATUS } from '../constants/mill.status.enum.js'

const MillSchema = new Schema(
    {
        millName: { type: String, required: true },
        millInfo: {
            gstNumber: { type: String, required: true },
            panNumber: { type: String, required: true }, // pan card number(Business / Company)
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
        },
        // Flattened status fields for quick middleware checks
        status: {
            type: String,
            enum: Object.values(MILL_STATUS),
            default: MILL_STATUS.PENDING_VERIFICATION,
        },
        // Changed from hardcoded enum to Reference
        currentPlan: { type: Schema.Types.ObjectId, ref: 'Plan' },
        planValidUntil: { type: Date },
        settings: {
            currency: { type: String, default: 'INR' },
            taxPercentage: { type: Number, default: 0 },
        },
    },
    { timestamps: true }
)

MillSchema.plugin(aggregatePaginate)

export const Mill = model('Mill', MillSchema)
