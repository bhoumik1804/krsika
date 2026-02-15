import {
    getPartyTransactionReport,
    getBrokerTransactionReport,
} from '../services/transaction-report.service.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const getPartyReportHandler = async (req, res, next) => {
    try {
        const { page, limit, partyName, startDate, endDate } = req.query
        const result = await getPartyTransactionReport(req.params.millId, {
            page,
            limit,
            partyName,
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, result, 'Party transaction report retrieved')
        )
    } catch (error) {
        next(error)
    }
}

export const getBrokerReportHandler = async (req, res, next) => {
    try {
        const { page, limit, brokerName, startDate, endDate } = req.query
        const result = await getBrokerTransactionReport(req.params.millId, {
            page,
            limit,
            brokerName,
            startDate,
            endDate,
        })
        res.status(200).json(
            new ApiResponse(200, result, 'Broker transaction report retrieved')
        )
    } catch (error) {
        next(error)
    }
}
