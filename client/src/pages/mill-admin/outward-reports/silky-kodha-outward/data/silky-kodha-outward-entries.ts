import { faker } from '@faker-js/faker'
import { type SilkyKodhaOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54344)

export const silkyKodhaOutwardEntries: SilkyKodhaOutward[] = Array.from(
    { length: 50 },
    (): SilkyKodhaOutward => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            silkyKodhaSaleDealNumber: `SKD-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            rate: faker.number.int({ min: 1500, max: 3000 }),
            oil: faker.number.float({ min: 5, max: 15, fractionDigits: 2 }),
            brokerage: faker.number.int({ min: 10, max: 50 }),
            gunnyPlastic: faker.number.int({ min: 10, max: 200 }),
            plasticWeight: faker.number.float({
                min: 0.1,
                max: 0.2,
                fractionDigits: 3,
            }),
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            truckRst: faker.string.alphanumeric(8).toUpperCase(),
            truckWeight: faker.number.float({
                min: 100,
                max: 500,
                fractionDigits: 2,
            }),
            gunnyWeight: faker.number.float({
                min: 10,
                max: 50,
                fractionDigits: 2,
            }),
            netWeight: faker.number.float({
                min: 80,
                max: 450,
                fractionDigits: 2,
            }),
        }
    }
)
