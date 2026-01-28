import { faker } from '@faker-js/faker'
import { type FinancialReceipt } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54333)

const dealTypes = ['खरीद', 'बिक्री', 'विनिमय']
const partyNames = [
    'राज ट्रेडर्स',
    'अमित एंटरप्राइजेस',
    'भारत अनाज',
    'सिंह ब्रदर्स',
    'पटेल इंडस्ट्रीज',
]
const brokerNames = [
    'राजेश ब्रोकर',
    'अजय कमीशन',
    'संजय डीलर',
    'मोहित एजेंसी',
    'विजय बिज़नेस',
]

export const FinancialReceiptEntries: FinancialReceipt[] = Array.from(
    { length: 50 },
    (_, index): FinancialReceipt => ({
        date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
        partyName: faker.helpers.arrayElement(partyNames),
        brokerName: faker.helpers.arrayElement(brokerNames),
        salesDealType: faker.helpers.arrayElement(dealTypes),
        salesDealNumber: String(50000 + index),
        receivedAmount: faker.number.float({
            min: 10000,
            max: 500000,
            fractionDigits: 2,
        }),
        remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
            probability: 0.3,
        }),
    })
)
