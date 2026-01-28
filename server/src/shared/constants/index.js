import * as appConfig from './app-config.js'
import * as errorCodes from './error-codes.js'
import * as inwardOutwardTypes from './inward-outward-types.js'
import * as miscTypes from './misc-types.js'
import * as pagination from './pagination.js'
import * as paymentTypes from './payment-types.js'
import * as purchaseTypes from './purchase-types.js'
import * as roles from './roles.js'
import * as saleTypes from './sale-types.js'
import * as stockTypes from './stock-types.js'
import * as transactionTypes from './transaction-types.js'

const aggregatedConstants = {
    ...roles,
    ...stockTypes,
    ...paymentTypes,
    ...transactionTypes,
    ...purchaseTypes,
    ...saleTypes,
    ...inwardOutwardTypes,
    ...miscTypes,
    ...errorCodes,
    ...pagination,
    ...appConfig,
}

export default aggregatedConstants
export { aggregatedConstants }
