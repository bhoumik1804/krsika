import { Schema, model } from 'mongoose'
import aggregatePaginate from 'mongoose-aggregate-paginate-v2'

/**
 * Govt Paddy Inward Schema
 * Tracks government paddy inward entries for a mill
 */
const GovtPaddyInwardSchema = new Schema(
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
        doNumber: {
            type: String,
            required: true,
            trim: true,
        },
        committeeName: {
            type: String,
            required: true,
            trim: true,
        },
        balanceDo: {
            type: Number,
            min: 0,
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
            required: true,
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
GovtPaddyInwardSchema.index({ millId: 1, date: -1 })
GovtPaddyInwardSchema.index({ millId: 1, doNumber: 1 })
GovtPaddyInwardSchema.index({ millId: 1, committeeName: 1 })
GovtPaddyInwardSchema.index({ millId: 1, truckNumber: 1 })
GovtPaddyInwardSchema.index({ millId: 1, paddyType: 1 })

// Text index for full-text search optimization
// Note: Only one text index per collection is allowed in MongoDB
GovtPaddyInwardSchema.index(
    {
        doNumber: 'text',
        committeeName: 'text',
        truckNumber: 'text',
        rstNumber: 'text',
        paddyType: 'text',
    },
    {
        weights: {
            doNumber: 10,
            committeeName: 8,
            truckNumber: 5,
            rstNumber: 3,
            paddyType: 3,
        },
        name: 'govt_paddy_inward_text_search',
    }
)

// Virtual for formatted date
GovtPaddyInwardSchema.virtual('formattedDate').get(function () {
    return this.date.toISOString().split('T')[0]
})

// Ensure virtuals are included in JSON output
GovtPaddyInwardSchema.set('toJSON', { virtuals: true })
GovtPaddyInwardSchema.set('toObject', { virtuals: true })

// Add aggregate paginate plugin
GovtPaddyInwardSchema.plugin(aggregatePaginate)

export const GovtPaddyInward = model('GovtPaddyInward', GovtPaddyInwardSchema)
