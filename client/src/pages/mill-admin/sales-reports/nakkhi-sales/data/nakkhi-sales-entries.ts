import { faker } from '@faker-js/faker'
import { type NakkhiSales } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54327)

export const nakkhiSalesEntries: NakkhiSales[] = Array.from(
    { length: 50 },
    (): NakkhiSales => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            brokerName: faker.helpers.maybe(() => faker.person.fullName(), {
                probability: 0.7,
            }),
            nakkhiQty: faker.number.float({
                min: 10,
                max: 500,
                fractionDigits: 2,
            }),
            nakkhiRate: faker.number.float({
                min: 100,
                max: 2000,
                fractionDigits: 2,
            }),
            batavPercent: faker.number.float({
                min: 0,
                max: 20,
                fractionDigits: 2,
            }),
            brokeragePerQuintal: faker.number.float({
                min: 10,
                max: 100,
                fractionDigits: 2,
            }),
        }
    }
)
