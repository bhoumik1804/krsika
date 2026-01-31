import { faker } from '@faker-js/faker'
import { type LabourInward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54333)

const inwardTypes = [
    'धान आवक',
    'चावल आवक',
    'बारदाना आवक',
    'FRK आवक',
    'अन्य आवक',
]
const labourGroups = [
    'रामलाल टीम',
    'श्यामलाल टीम',
    'मोहन टीम',
    'सोहन टीम',
    'राधेश्याम टीम',
]

export const labourInwardEntries: LabourInward[] = Array.from(
    { length: 50 },
    (): LabourInward => {
        const inwardType = faker.helpers.arrayElement(inwardTypes)
        const totalGunny = ['धान आवक', 'चावल आवक', 'FRK आवक'].includes(
            inwardType
        )
            ? faker.number.int({ min: 50, max: 500 })
            : undefined
        const numberOfGunnyBundle =
            inwardType === 'बारदाना आवक'
                ? faker.number.int({ min: 5, max: 50 })
                : undefined

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            inwardType,
            truckNumber: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            totalGunny,
            numberOfGunnyBundle,
            unloadingRate: faker.number.float({
                min: 2,
                max: 5,
                fractionDigits: 2,
            }),
            stackingRate: faker.number.float({
                min: 1,
                max: 3,
                fractionDigits: 2,
            }),
            labourGroupName: faker.helpers.arrayElement(labourGroups),
        }
    }
)
