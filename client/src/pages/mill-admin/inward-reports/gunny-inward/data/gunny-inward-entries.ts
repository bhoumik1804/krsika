import { faker } from '@faker-js/faker'
import { type GunnyInward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(45678)

export const gunnyInwardEntries: GunnyInward[] = Array.from(
    { length: 50 },
    (): GunnyInward => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            purchaseDealId: faker.string.alphanumeric(8).toUpperCase(),
            partyName: faker.person.fullName(),
            delivery: faker.helpers.arrayElement([
                'Mill Delivery',
                'Samiti Delivery',
                'Direct Delivery',
            ]),
            samitiSangrahan: faker.company.name(),
            gunnyNew: faker.number.int({ min: 0, max: 500 }),
            gunnyOld: faker.number.int({ min: 0, max: 500 }),
            gunnyPlastic: faker.number.int({ min: 0, max: 200 }),
        }
    }
)
