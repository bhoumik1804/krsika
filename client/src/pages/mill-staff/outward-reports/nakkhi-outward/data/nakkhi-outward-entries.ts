import { faker } from '@faker-js/faker'
import { type NakkhiOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54341)

export const nakkhiOutwardEntries: NakkhiOutward[] = Array.from(
    { length: 50 },
    (): NakkhiOutward => {
        const gunnyPlastic = faker.number.int({ min: 10, max: 200 })
        const plasticWeight = faker.number.float({
            min: 0.1,
            max: 0.2,
            fractionDigits: 3,
        })
        const gunnyWeight = gunnyPlastic * plasticWeight

        const truckWeight = faker.number.float({
            min: 100,
            max: 500,
            fractionDigits: 2,
        })
        const netWeight = truckWeight - gunnyWeight

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            nakkhiSaleDealNumber: `NSD-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            rate: faker.number.int({ min: 1500, max: 2500 }),
            brokerage: faker.number.int({ min: 10, max: 50 }),
            gunnyPlastic,
            plasticWeight,
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            truckRst: faker.string.alphanumeric(8).toUpperCase(),
            truckWeight,
            gunnyWeight,
            netWeight,
        }
    }
)
