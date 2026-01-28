import mongoose from 'mongoose'

const committeeSchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Committee name is required'],
            trim: true,
        },
        phone: String,
        address: String,
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
committeeSchema.index({ millId: 1, isActive: 1 })

// Instance method to update balance
committeeSchema.methods.updateBalance = async function (amount) {
    this.currentBalance += amount
    return await this.save()
}

const Committee = mongoose.model('Committee', committeeSchema)

export default Committee
