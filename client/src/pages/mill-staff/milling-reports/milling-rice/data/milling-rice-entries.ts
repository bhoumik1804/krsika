import { faker } from '@faker-js/faker'
import { riceTypeOptions } from '@/constants/purchase-form'
import { type MillingRice } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const millingRiceEntries: MillingRice[] = Array.from(
    { length: 50 },
    (): MillingRice => {
        const riceType = faker.helpers.arrayElement(riceTypeOptions).value

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            riceType,
            hopperInGunny: faker.number.int({ min: 50, max: 400 }),
            hopperInQintal: faker.number.float({
                min: 45,
                max: 380,
                fractionDigits: 2,
            }),
            riceQuantity: faker.number.float({
                min: 40,
                max: 350,
                fractionDigits: 2,
            }),
            ricePercentage: faker.number.float({
                min: 40,
                max: 75,
                fractionDigits: 2,
            }),
            khandaQuantity: faker.number.float({
                min: 2,
                max: 35,
                fractionDigits: 2,
            }),
            khandaPercentage: faker.number.float({
                min: 2,
                max: 12,
                fractionDigits: 2,
            }),
            silkyKodhaQuantity: faker.number.float({
                min: 1,
                max: 25,
                fractionDigits: 2,
            }),
            silkyKodhaPercentage: faker.number.float({
                min: 1,
                max: 10,
                fractionDigits: 2,
            }),
            wastagePercentage: faker.number.float({
                min: 0.1,
                max: 5,
                fractionDigits: 2,
            }),
        }
    }
)
