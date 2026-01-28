import { faker } from '@faker-js/faker'
import { type KhandaSales } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54328)

export const khandaSalesEntries: KhandaSales[] = Array.from(
    { length: 50 },
    (): KhandaSales => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            brokerName: faker.helpers.maybe(() => faker.person.fullName(), {
                probability: 0.7,
            }),
            khandaQty: faker.number.float({
                min: 10,
                max: 500,
                fractionDigits: 2,
            }),
            khandaRate: faker.number.float({
                min: 100,
                max: 2000,
                fractionDigits: 2,
            }),
            discountPercent: faker.number.float({
                min: 0,
                max: 10,
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
