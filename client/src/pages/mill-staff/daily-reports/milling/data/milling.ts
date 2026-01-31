import { faker } from '@faker-js/faker'
import { type MillingEntry } from './schema'

faker.seed(67890)

export const millingEntries: MillingEntry[] = Array.from(
    { length: 30 },
    (): MillingEntry => {
        const paddyQuantity = faker.number.int({ min: 100, max: 500 })

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            shift: faker.helpers.arrayElement(['Day', 'Night']),
            paddyType: faker.helpers.arrayElement([
                'Paddy (Common)',
                'Paddy (Grade A)',
                'Basmati',
            ]),
            paddyQuantity,
            riceYield: paddyQuantity * 65, // 65% yield approx
            brokenYield: paddyQuantity * 3,
            branYield: paddyQuantity * 8,
            huskYield: paddyQuantity * 20,
            status: faker.helpers.arrayElement([
                'completed',
                'in-progress',
                'scheduled',
            ]),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.1,
            }),
        }
    }
)
