import { faker } from '@faker-js/faker'
import { type BalanceLiftingPurchasesFrk } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54324)

export const balanceLiftingPurchasesFrkEntries: BalanceLiftingPurchasesFrk[] =
    Array.from({ length: 50 }, (): BalanceLiftingPurchasesFrk => {
        const frkQty = faker.number.int({ min: 20, max: 300 })
        const frkRate = faker.number.int({ min: 1200, max: 2000 })
        const gst = faker.number.float({ min: 5, max: 18, fractionDigits: 2 })

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            frkQty,
            frkRate,
            gst,
        }
    })
