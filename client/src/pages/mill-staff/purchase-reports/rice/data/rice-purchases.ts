import { faker } from '@faker-js/faker'
import {
    riceTypeOptions,
    deliveryTypeOptions,
    fciOrNANOptions,
    lotOrOtherTypeOptions,
    frkTypeOptions,
    gunnyTypeOptions,
} from '@/constants/purchase-form'
import { type RicePurchaseData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const ricePurchases: RicePurchaseData[] = Array.from(
    { length: 50 },
    (): RicePurchaseData => {
        const totalQty = faker.number.float({
            min: 100,
            max: 1000,
            fractionDigits: 2,
        })
        const ratePerQuintal = faker.number.float({
            min: 2800,
            max: 4500,
            fractionDigits: 2,
        })

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            brokerName: faker.helpers.maybe(() => faker.person.fullName(), {
                probability: 0.7,
            }),
            deliveryType: faker.helpers.arrayElement(
                deliveryTypeOptions.map((opt: { value: string }) => opt.value)
            ),
            lotOrOther: faker.helpers.arrayElement(
                lotOrOtherTypeOptions.map((opt: { value: string }) => opt.value)
            ),

            // LOT Specific
            fciOrNAN: faker.helpers.arrayElement(
                fciOrNANOptions.map((opt: { value: string }) => opt.value)
            ),
            lotNumber: faker.helpers.maybe(
                () => `LOT-${faker.number.int({ min: 1000, max: 9999 })}`,
                { probability: 0.6 }
            ),
            frkType: faker.helpers.arrayElement(
                frkTypeOptions.map((opt: { value: string }) => opt.value)
            ),
            frkRatePerQuintal: faker.number.float({
                min: 200,
                max: 500,
                fractionDigits: 2,
            }),

            // Rice Specific
            riceType: faker.helpers.arrayElement(
                riceTypeOptions.map((opt: { value: string }) => opt.value)
            ),

            // Common
            riceQty: totalQty,
            riceRate: ratePerQuintal,
            discountPercent: faker.number.float({
                min: 0,
                max: 5,
                fractionDigits: 2,
            }),
            brokeragePerQuintal: faker.number.float({
                min: 10,
                max: 50,
                fractionDigits: 2,
            }),
            gunnyType: faker.helpers.arrayElement(
                gunnyTypeOptions.map((opt: { value: string }) => opt.value)
            ),

            newGunnyRate: faker.number.float({
                min: 0,
                max: 50,
                fractionDigits: 2,
            }),
            oldGunnyRate: faker.number.float({
                min: 0,
                max: 30,
                fractionDigits: 2,
            }),
            plasticGunnyRate: faker.number.float({
                min: 0,
                max: 40,
                fractionDigits: 2,
            }),
        }
    }
)
