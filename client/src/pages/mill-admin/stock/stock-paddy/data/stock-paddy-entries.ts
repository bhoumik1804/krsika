import { faker } from '@faker-js/faker'
import { type StockPaddy } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const stockPaddyEntries: StockPaddy[] = Array.from(
    { length: 5 },
    (): StockPaddy => {
        return {
            id: faker.string.uuid(),
            mota: faker.number.int({ min: 100, max: 1000 }),
            patla: faker.number.int({ min: 100, max: 1000 }),
            sarna: faker.number.int({ min: 100, max: 1000 }),
            mahamaya: faker.number.int({ min: 100, max: 1000 }),
            rbGold: faker.number.int({ min: 100, max: 1000 }),
        }
    }
)
