import { faker } from '@faker-js/faker'
import { type TransactionBroker } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54321)

export const paddyPurchases: TransactionBroker[] = Array.from(
    { length: 50 },
    (): TransactionBroker => {
        const bags = faker.number.int({ min: 10, max: 500 })
        const weight = faker.number.float({
            min: bags * 45,
            max: bags * 55,
            fractionDigits: 2,
        })
        const moisture = faker.number.float({
            min: 10,
            max: 20,
            fractionDigits: 1,
        })
        const rate = faker.number.int({ min: 1800, max: 2500 })
        const amount = Math.floor(weight * rate)

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            vehicleNumber: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            bags,
            weight,
            moisture,
            rate,
            amount,
            status: faker.helpers.arrayElement([
                'pending',
                'completed',
                'cancelled',
            ]),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
        }
    }
)
