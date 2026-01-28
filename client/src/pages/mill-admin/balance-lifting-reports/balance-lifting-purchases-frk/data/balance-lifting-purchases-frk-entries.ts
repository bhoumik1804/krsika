import { faker } from '@faker-js/faker'
import { type BalanceLiftingPurchasesFrk } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54324)

export const balanceLiftingPurchasesFrkEntries: BalanceLiftingPurchasesFrk[] = Array.from(
    { length: 50 },
    (): BalanceLiftingPurchasesFrk => {
        const bags = faker.number.int({ min: 20, max: 300 })
        const weight = faker.number.float({
            min: bags * 40,
            max: bags * 50,
            fractionDigits: 2,
        })
        const rate = faker.number.int({ min: 1200, max: 2000 })
        const amount = Math.floor(weight * rate)

        return {
            id: faker.string.uuid(),
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
    }
)
