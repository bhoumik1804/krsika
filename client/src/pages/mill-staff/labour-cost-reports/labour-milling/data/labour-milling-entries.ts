import { faker } from '@faker-js/faker'
import { type LabourMilling } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

const labourGroupNames = [
    'रामलाल टीम',
    'श्यामलाल टीम',
    'मोहन टीम',
    'सोहन टीम',
    'राधेश्याम टीम',
]

export const labourMillingEntries: LabourMilling[] = Array.from(
    { length: 50 },
    (): LabourMilling => ({
        date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
        hopperInGunny: faker.number.int({ min: 10, max: 200 }),
        hopperRate: faker.number.float({
            min: 2,
            max: 5,
            fractionDigits: 2,
        }),
        labourGroupName: faker.helpers.arrayElement(labourGroupNames),
    })
)
