import { faker } from '@faker-js/faker'
import { type StockOther } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const stockOtherEntries: StockOther[] = Array.from(
    { length: 5 },
    (): StockOther => {
        return {
            id: faker.string.uuid(),
            frk: faker.number.int({ min: 10, max: 100 }),
        }
    }
)
