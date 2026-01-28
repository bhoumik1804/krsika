import { faker } from '@faker-js/faker'
import { type BalanceLiftingPurchasesGunny } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54323)

export const balanceLiftingPurchasesGunnyEntries: BalanceLiftingPurchasesGunny[] =
    Array.from({ length: 50 }, (): BalanceLiftingPurchasesGunny => {
        const deliveryType = faker.helpers.arrayElement([
            'new',
            'old',
            'plastic',
        ])
        let newGunnyQty,
            newGunnyRate,
            oldGunnyQty,
            oldGunnyRate,
            plasticGunnyQty,
            plasticGunnyRate

        if (deliveryType === 'new') {
            newGunnyQty = faker.number.int({ min: 100, max: 1000 })
            newGunnyRate = faker.number.int({ min: 6, max: 12 })
        } else if (deliveryType === 'old') {
            oldGunnyQty = faker.number.int({ min: 100, max: 1000 })
            oldGunnyRate = faker.number.int({ min: 4, max: 8 })
        } else {
            plasticGunnyQty = faker.number.int({ min: 100, max: 1000 })
            plasticGunnyRate = faker.number.int({ min: 8, max: 15 })
        }

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            deliveryType,
            newGunnyQty,
            newGunnyRate,
            oldGunnyQty,
            oldGunnyRate,
            plasticGunnyQty,
            plasticGunnyRate,
        }
    })
