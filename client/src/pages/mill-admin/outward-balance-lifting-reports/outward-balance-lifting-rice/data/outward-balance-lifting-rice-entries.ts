import { faker } from '@faker-js/faker'
import { type OutwardBalanceLiftingRice } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54345)

export const outwardBalanceLiftingRiceEntries: OutwardBalanceLiftingRice[] =
    Array.from({ length: 50 }, (): OutwardBalanceLiftingRice => {
        const bags = faker.number.int({ min: 10, max: 500 })
        const weight = faker.number.float({
            min: bags * 40,
            max: bags * 60,
            fractionDigits: 2,
        })
        const rate = faker.number.int({ min: 1800, max: 3500 })
        const amount = Math.floor(weight * rate)

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            vehicleNumber: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            bags,
            weight,
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
    })
