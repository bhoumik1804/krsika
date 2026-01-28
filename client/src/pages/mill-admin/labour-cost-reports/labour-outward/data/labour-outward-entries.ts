import { faker } from '@faker-js/faker'
import { type LabourOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54339)

const outwardTypes = [
    'धान जावक',
    'चावल जावक',
    'बारदाना जावक',
    'FRK जावक',
    'अन्य जावक',
]
const labourGroups = [
    'रामलाल टीम',
    'श्यामलाल टीम',
    'मोहन टीम',
    'सोहन टीम',
    'राधेश्याम टीम',
]

export const labourOutwardEntries: LabourOutward[] = Array.from(
    { length: 50 },
    (): LabourOutward => {
        const outwardType = faker.helpers.arrayElement(outwardTypes)
        const totalGunny = ['धान जावक', 'चावल जावक', 'FRK जावक'].includes(
            outwardType
        )
            ? faker.number.int({ min: 50, max: 500 })
            : undefined
        const numberOfGunnyBundle =
            outwardType === 'बारदाना जावक'
                ? faker.number.int({ min: 5, max: 50 })
                : undefined

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            outwardType,
            truckNumber: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            totalGunny,
            numberOfGunnyBundle,
            loadingRate: faker.number.float({
                min: 2,
                max: 5,
                fractionDigits: 2,
            }),
            dhulaiRate: faker.number.float({
                min: 1,
                max: 3,
                fractionDigits: 2,
            }),
            labourGroupName: faker.helpers.arrayElement(labourGroups),
        }
    }
)
