import { faker } from '@faker-js/faker'
import { type BalanceLiftingPurchasesGunny } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54323)

export const balanceLiftingPurchasesGunnyEntries: BalanceLiftingPurchasesGunny[] = Array.from(
    { length: 50 },
    (): BalanceLiftingPurchasesGunny => {
        const bags = faker.number.int({ min: 100, max: 1000 })
        const weight = faker.number.float({
            min: bags * 0.06,
            max: bags * 0.08,
            fractionDigits: 2,
        })
        const rate = faker.number.int({ min: 6, max: 12 })
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
