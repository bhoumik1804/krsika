import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Private Paddy Inward Schema
 * Tracks private paddy inward entries for a mill
 */
const PrivatePaddyInwardSchema = new Schema(
    {
        millId: {
            type: Schema.Types.ObjectId,
            ref: 'Mill',
            required: true,
            index: true,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        paddyPurchaseDealNumber: {
            type: String,
            trim: true,
        },
        partyName: {
            type: String,
            trim: true,
        },
        brokerName: {
            type: String,
            trim: true,
        },
        balanceDo: {
            type: Number,
            min: 0,
        },
        purchaseType: {
            type: String,
            trim: true,
        },
        doNumber: {
            type: String,
            trim: true,
        },
        committeeName: {
            type: String,
            trim: true,
        },
        gunnyOption: {
            type: String,
            trim: true,
        },
        gunnyNew: {
            type: Number,
            min: 0,
        },
        gunnyOld: {
            type: Number,
            min: 0,
        },
        gunnyPlastic: {
            type: Number,
            min: 0,
        },
        juteWeight: {
            type: Number,
            min: 0,
        },
        plasticWeight: {
            type: Number,
            min: 0,
        },
        gunnyWeight: {
            type: Number,
            min: 0,
        },
        truckNumber: {
            type: String,
            trim: true,
            uppercase: true,
        },
        rstNumber: {
            type: String,
            trim: true,
        },
        truckLoadWeight: {
            type: Number,
            min: 0,
        },
        paddyType: {
            type: String,
            trim: true,
        },
        paddyMota: {
            type: Number,
            min: 0,
        },
        paddyPatla: {
            type: Number,
            min: 0,
        },
        paddySarna: {
            type: Number,
            min: 0,
        },
        paddyMahamaya: {
            type: Number,
            min: 0,
        },
        paddyRbGold: {
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
PrivatePaddyInwardSchema.index({ millId: 1, date: -1 })
PrivatePaddyInwardSchema.index({ millId: 1, partyName: 1 })
PrivatePaddyInwardSchema.index({ millId: 1, brokerName: 1 })
PrivatePaddyInwardSchema.index({ millId: 1, purchaseType: 1 })
PrivatePaddyInwardSchema.index({ millId: 1, paddyType: 1 })
PrivatePaddyInwardSchema.index({ millId: 1, committeeName: 1 })
PrivatePaddyInwardSchema.index({ millId: 1, truckNumber: 1 })
PrivatePaddyInwardSchema.index({ millId: 1, paddyPurchaseDealNumber: 1 })

// Virtual for formatted date
PrivatePaddyInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
PrivatePaddyInwardSchema.set('toJSON', { virtuals: true })
PrivatePaddyInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
PrivatePaddyInwardSchema.plugin(aggregatePaginate)

export const PrivatePaddyInward = model(
    'PrivatePaddyInward',
    PrivatePaddyInwardSchema
)
