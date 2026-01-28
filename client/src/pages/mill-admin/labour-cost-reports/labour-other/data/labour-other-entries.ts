import { faker } from '@faker-js/faker'
import { type LabourOther } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

const labourTypes = ['पाला भराई', 'कांटा', 'सिलाई', 'अन्य']
const labourGroupNames = [
    'रामलाल टीम',
    'श्यामलाल टीम',
    'मोहन टीम',
    'सोहन टीम',
    'राधेश्याम टीम',
]

export const labourOtherEntries: LabourOther[] = Array.from(
    { length: 50 },
    (): LabourOther => {
        const labourType = faker.helpers.arrayElement(labourTypes)
        const isOtherType = labourType === 'अन्य'

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            labourType,
            labourGroupName: faker.helpers.arrayElement(labourGroupNames),
            numberOfGunny: !isOtherType
                ? faker.number.int({ min: 10, max: 300 })
                : undefined,
            labourRate: !isOtherType
                ? faker.number.float({ min: 2, max: 8, fractionDigits: 2 })
                : undefined,
            workDetail: isOtherType ? faker.lorem.sentence() : undefined,
            totalPrice: isOtherType
                ? faker.number.float({
                      min: 500,
                      max: 5000,
                      fractionDigits: 2,
                  })
                : undefined,
        }
    }
)
