import { faker } from '@faker-js/faker'
import { type BrokerTransaction } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54321)

export const paddyPurchases: BrokerTransaction[] = Array.from(
    { length: 50 },
    (): BrokerTransaction => {
        return {
            brokerName: faker.person.fullName(),
            partyName: faker.person.fullName(),
            date: faker.date.recent().toISOString().split('T')[0],
            purchaseDeal: faker.number.int({ min: 100, max: 1000 }),
            salesDeal: faker.number.int({ min: 100, max: 1000 }),
            inward: faker.number.int({ min: 50, max: 500 }),
            outward: faker.number.int({ min: 50, max: 500 }),
            accountReceipt: faker.number.int({ min: 10000, max: 50000 }),
            accountPayment: faker.number.int({ min: 10000, max: 50000 }),
            accountBrokerage: faker.number.int({ min: 1000, max: 5000 }),
            receipt: faker.number.int({ min: 10000, max: 50000 }),
            payment: faker.number.int({ min: 10000, max: 50000 }),
            brokerage: faker.number.int({ min: 1000, max: 5000 }),
        }
    }
)
