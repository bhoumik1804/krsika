import mongoose from 'mongoose'

const partySchema = new mongoose.Schema(
    {
        millId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        name: {
            type: String,
            required: [true, 'Party name is required'],
            trim: true,
        },
        gstn: {
            type: String,
            uppercase: true,
            trim: true,
        },
        phone: {
            type: String,
        },
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },
        address: String,
        city: String,
        state: String,
        pincode: String,
        bankName: String,
        accountNumber: String,
        ifscCode: String,
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
partySchema.index({ millId: 1, isActive: 1 })
partySchema.index({ millId: 1, name: 1 })
partySchema.index({ millId: 1, name: 'text' }) // Text search

// Instance method to update balance
partySchema.methods.updateBalance = async function (amount) {
    this.currentBalance += amount
    return await this.save()
}

const Party = mongoose.model('Party', partySchema)

export default Party
