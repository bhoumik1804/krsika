import { faker } from '@faker-js/faker'
import { type StockRice } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const stockRiceEntries: StockRice[] = Array.from(
    { length: 5 },
    (): StockRice => {
        return {
            id: faker.string.uuid(),
            mota: faker.number.int({ min: 100, max: 1000 }),
            patla: faker.number.int({ min: 100, max: 1000 }),
        }
    }
)
