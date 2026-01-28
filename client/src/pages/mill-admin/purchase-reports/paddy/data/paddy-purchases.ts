import { faker } from '@faker-js/faker'
import {
    paddyTypeOptions,
    deliveryTypeOptions,
    paddyPurchaseTypeOptions,
    gunnyTypeOptions,
} from '@/constants/purchase-form'
import { type PaddyPurchase } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54321)

export const paddyPurchases: PaddyPurchase[] = Array.from(
    { length: 50 },
    (): PaddyPurchase => {
        const totalQty = faker.number.float({
            min: 100,
            max: 1000,
            fractionDigits: 2,
        })
        const ratePerQuintal = faker.number.float({
            min: 1800,
            max: 2500,
            fractionDigits: 2,
        })

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            brokerName: faker.helpers.maybe(() => faker.person.fullName(), {
                probability: 0.7,
            }),
            deliveryType: faker.helpers.arrayElement(
                deliveryTypeOptions.map((opt) => opt.value)
            ),
            purchaseType: faker.helpers.arrayElement(
                paddyPurchaseTypeOptions.map((opt) => opt.value)
            ),
            doNumber: faker.helpers.maybe(
                () => `DO-${faker.number.int({ min: 1000, max: 9999 })}`,
                { probability: 0.6 }
            ),
            committeeName: faker.helpers.maybe(() => faker.company.name(), {
                probability: 0.4,
            }),
            doPaddyQty: faker.number.float({
                min: 50,
                max: 500,
                fractionDigits: 2,
            }),
            paddyType: faker.helpers.arrayElement(
                paddyTypeOptions.map((opt) => opt.value)
            ),
            totalPaddyQty: totalQty,
            paddyRatePerQuintal: ratePerQuintal,
            discountPercent: faker.number.float({
                min: 0,
                max: 5,
                fractionDigits: 2,
            }),
            brokerage: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
            gunnyType: faker.helpers.arrayElement(
                gunnyTypeOptions.map((opt) => opt.value)
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
