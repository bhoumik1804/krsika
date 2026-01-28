import { faker } from '@faker-js/faker'
import { type GunnySales } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const gunnySalesEntries: GunnySales[] = Array.from(
    { length: 50 },
    (): GunnySales => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            newGunnyQty: faker.number.float({
                min: 10,
                max: 500,
                fractionDigits: 2,
            }),
            newGunnyRate: faker.number.float({
                min: 8,
                max: 15,
                fractionDigits: 2,
            }),
            oldGunnyQty: faker.number.float({
                min: 5,
                max: 300,
                fractionDigits: 2,
            }),
            oldGunnyRate: faker.number.float({
                min: 3,
                max: 8,
                fractionDigits: 2,
            }),
            plasticGunnyQty: faker.number.float({
                min: 5,
                max: 200,
                fractionDigits: 2,
            }),
            plasticGunnyRate: faker.number.float({
                min: 5,
                max: 12,
                fractionDigits: 2,
            }),
        }
    }
)
