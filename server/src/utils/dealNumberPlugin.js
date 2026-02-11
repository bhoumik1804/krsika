/**
 * Deal Number Plugin for Mongoose
 * Auto-generates deal numbers in format: PREFIX-DDMMYY-SERIAL
 * Serial resets to 01 each day, per millId
 *
 * Usage:
 *   schema.plugin(dealNumberPlugin, { fieldName: 'riceSalesDealNumber', prefix: 'RCS' })
 */
export function dealNumberPlugin(schema, options) {
    const { fieldName, prefix } = options

    // Add the deal number field to the schema
    schema.add({
        [fieldName]: {
            type: String,
            trim: true,
            index: true,
        },
    })

    // Pre-save hook to auto-generate deal number
    schema.pre('save', async function () {
        // Only generate for new documents that don't already have a deal number
        if (!this.isNew || this[fieldName]) return

        const date = this.date || new Date()

        // Format date as DDMMYY
        const dd = String(date.getDate()).padStart(2, '0')
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const yy = String(date.getFullYear()).slice(-2)
        const dateStr = `${dd}${mm}${yy}`

        // Count existing documents for same millId and same day
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const count = await this.constructor.countDocuments({
            millId: this.millId,
            date: { $gte: startOfDay, $lte: endOfDay },
        })

        const serial = String(count + 1).padStart(2, '0')
        this[fieldName] = `${prefix}-${dateStr}-${serial}`
    })
}
