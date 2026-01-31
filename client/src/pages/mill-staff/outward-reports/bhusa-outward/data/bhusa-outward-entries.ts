import { faker } from '@faker-js/faker'
import { type BhusaOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54342)

export const bhusaOutwardEntries: BhusaOutward[] = Array.from(
    { length: 50 },
    (): BhusaOutward => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            bhusaSaleDealNumber: `BSD-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            rate: faker.number.int({ min: 500, max: 1500 }),
            brokerage: faker.number.int({ min: 5, max: 20 }),
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            truckRst: faker.string.alphanumeric(8).toUpperCase(),
            truckWeight: faker.number.float({
                min: 100,
                max: 500,
                fractionDigits: 2,
            }),
        }
    }
)
