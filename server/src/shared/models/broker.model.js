import mongoose from 'mongoose'

const brokerSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Broker name is required'],
            trim: true,
        },
        phone: String,
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        address: String,
        commissionRate: {
            type: Number,
            default: 0,
            min: [0, 'Commission rate cannot be negative'],
        },
        openingBalance: {
            type: Number,
            default: 0,
        },
        currentBalance: {
            type: Number,
            default: 0,
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
brokerSchema.index({ millId: 1, isActive: 1 })
brokerSchema.index({ millId: 1, name: 'text' }) // Text search

// Instance method to update balance
brokerSchema.methods.updateBalance = async function (amount) {
    this.currentBalance += amount
    return await this.save()
}

const Broker = mongoose.model('Broker', brokerSchema)

export default Broker
