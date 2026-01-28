import { faker } from '@faker-js/faker'
import { type StockByProducts } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const stockByProductsEntries: StockByProducts[] = Array.from(
    { length: 5 },
    (): StockByProducts => {
        return {
            id: faker.string.uuid(),
            khanda: faker.number.int({ min: 100, max: 1000 }),
            koda: faker.number.int({ min: 100, max: 1000 }),
            nakkhi: faker.number.int({ min: 100, max: 1000 }),
            silkyKoda: faker.number.int({ min: 100, max: 1000 }),
            bhusa: faker.number.int({ min: 10, max: 100 }), // Bhusa in Tonnes might have different range
        }
    }
)
