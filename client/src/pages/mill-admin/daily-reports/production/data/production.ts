import { faker } from '@faker-js/faker'
import { type ProductionEntry } from './schema'

faker.seed(78901)

export const productionEntries: ProductionEntry[] = Array.from(
    { length: 40 },
    (): ProductionEntry => {
        const bags = faker.number.int({ min: 100, max: 500 })
        const weight = bags * 50

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 15 }).toISOString().split('T')[0],
            itemName: faker.helpers.arrayElement([
                'Rice',
                'Bran',
                'Husk',
                'Broken Rice',
            ]),
            itemType: faker.helpers.arrayElement([
                'Basmati',
                'Sona Masoori',
                'Grade A',
                'Common',
            ]),
            bags,
            weight,
            warehouse: `Warehouse ${faker.helpers.arrayElement(['A', 'B', 'C', 'D'])}`,
            stackNumber: `ST-${faker.number.int({ min: 1, max: 50 })}`,
            status: faker.helpers.arrayElement([
                'stocked',
                'verified',
                'pending',
            ]),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.1,
            }),
        }
    }
)
