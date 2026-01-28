/**
 * Central export point for all Mongoose models
 * Import models using: import { User, Mill, Purchase } from './models/index.js'
 */
import AuditLog from './audit-log.model.js'
import Broker from './broker.model.js'
import Committee from './committee.model.js'
import Mill from './mill.model.js'
import Party from './party.model.js'
import Purchase from './purchase.model.js'
import Receipt from './receipt.model.js'
import RefreshToken from './refresh-token.model.js'
import Sale from './sale.model.js'
import Staff from './staff.model.js'
import Stock from './stock.model.js'
import Transporter from './transporter.model.js'
import User from './user.model.js'

// Export all models
export {
    User,
    RefreshToken,
    Mill,
    Staff,
    Party,
    Broker,
    Transporter,
    Committee,
    Purchase,
    Sale,
    Stock,
    Receipt,
    AuditLog,
}

// Default export as object
export default {
    User,
    RefreshToken,
    Mill,
    Staff,
    Party,
    Broker,
    Transporter,
    Committee,
    Purchase,
    Sale,
    Stock,
    Receipt,
    AuditLog,
}
