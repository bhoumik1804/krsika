import { faker } from '@faker-js/faker'
import { type GovtGunnyOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(543410)

export const govtGunnyOutwardEntries: GovtGunnyOutward[] = Array.from(
    { length: 50 },
    (): GovtGunnyOutward => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            gunnyDm: `DM-${faker.number.int({ min: 1000, max: 9999 })}`,
            samitiSangrahan: faker.company.name(),
            oldGunnyQty: faker.number.float({
                min: 100,
                max: 1000,
                fractionDigits: 2,
            }),
            plasticGunnyQty: faker.number.float({
                min: 50,
                max: 500,
                fractionDigits: 2,
            }),
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        }
    }
)
