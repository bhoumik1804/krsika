import { faker } from '@faker-js/faker'
import { paddyTypeOptions, riceTypeOptions } from '@/constants/purchase-form'
import { type MillingPaddy } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const millingPaddyEntries: MillingPaddy[] = Array.from(
    { length: 50 },
    (): MillingPaddy => {
        const paddyType = faker.helpers.arrayElement(paddyTypeOptions).value
        const riceType = faker.helpers.arrayElement(riceTypeOptions).value
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            paddyType,
            riceType,
            hopperInGunny: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
            hopperInQintal: faker.number.float({
                min: 0,
                max: 10,
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
            kodhaQuantity: faker.number.float({
                min: 1,
                max: 25,
                fractionDigits: 2,
            }),
            kodhaPercentage: faker.number.float({
                min: 1,
                max: 10,
                fractionDigits: 2,
            }),
            bhusaTon: faker.number.float({
                min: 0.1,
                max: 4,
                fractionDigits: 2,
            }),
            bhusaPercentage: faker.number.float({
                min: 1,
                max: 10,
                fractionDigits: 2,
            }),
            nakkhiQuantity: faker.number.float({
                min: 1,
                max: 20,
                fractionDigits: 2,
            }),
            nakkhiPercentage: faker.number.float({
                min: 0.5,
                max: 8,
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
