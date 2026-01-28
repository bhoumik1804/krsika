import { faker } from '@faker-js/faker'
import { gunnyDeliveryTypeOptions } from '@/constants/purchase-form'
import { type GunnyPurchase } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54323)

export const gunnyPurchases: GunnyPurchase[] = Array.from(
    { length: 50 },
    (): GunnyPurchase => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            deliveryType: faker.helpers.arrayElement(gunnyDeliveryTypeOptions)
                .value,
            newGunnyQty: faker.number.int({ min: 100, max: 1000 }),
            newGunnyRate: faker.number.int({ min: 6, max: 12 }),
            oldGunnyQty: faker.number.int({ min: 100, max: 1000 }),
            oldGunnyRate: faker.number.int({ min: 6, max: 12 }),
            plasticGunnyQty: faker.number.int({ min: 100, max: 1000 }),
            plasticGunnyRate: faker.number.int({ min: 6, max: 12 }),
        }
    }
)
