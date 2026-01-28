import { faker } from '@faker-js/faker'
import { type PartyTransaction } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const partyTransactionEntries: PartyTransaction[] = Array.from(
    { length: 20 },
    (): PartyTransaction => {
        return {
            partyName: faker.company.name(),
            brokerName: faker.person.fullName(),
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            purchaseDeal: faker.number.int({ min: 1000, max: 100000 }),
            salesDeal: faker.number.int({ min: 1000, max: 100000 }),
            inward: faker.number.int({ min: 100, max: 5000 }),
            outward: faker.number.int({ min: 100, max: 5000 }),
            accountReceipt: faker.number.int({ min: 5000, max: 50000 }),
            accountPayment: faker.number.int({ min: 5000, max: 50000 }),
            accountBrokerage: faker.number.int({ min: 100, max: 5000 }),
            receipt: faker.number.int({ min: 5000, max: 50000 }),
            payment: faker.number.int({ min: 5000, max: 50000 }),
            brokerage: faker.number.int({ min: 100, max: 5000 }),
        }
    }
)
