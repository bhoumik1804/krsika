import { faker } from '@faker-js/faker'
import { type StockGunny } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const stockGunnyEntries: StockGunny[] = Array.from(
    { length: 5 },
    (): StockGunny => {
        return {
            id: faker.string.uuid(),
            filledNew: faker.number.int({ min: 100, max: 1000 }),
            filledOld: faker.number.int({ min: 100, max: 1000 }),
            filledPlastic: faker.number.int({ min: 100, max: 1000 }),
            emptyNew: faker.number.int({ min: 100, max: 1000 }),
            emptyOld: faker.number.int({ min: 100, max: 1000 }),
            emptyPlastic: faker.number.int({ min: 100, max: 1000 }),
        }
    }
)
