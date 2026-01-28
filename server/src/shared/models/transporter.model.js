import mongoose from 'mongoose'

const transporterSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Transporter name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone is required'],
        },
        address: String,
        vehicleNumbers: {
            type: [String],
            default: [],
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
transporterSchema.index({ millId: 1, isActive: 1 })

const Transporter = mongoose.model('Transporter', transporterSchema)

export default Transporter
