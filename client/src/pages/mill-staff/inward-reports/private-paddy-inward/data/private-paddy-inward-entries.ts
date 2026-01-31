import { faker } from '@faker-js/faker'
import {
    gunnyTypeOptions,
    paddyPurchaseTypeOptions,
    paddyTypeOptions,
} from '@/constants/purchase-form'
import { type PrivatePaddyInward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54333)

export const privatePaddyInwardEntries: PrivatePaddyInward[] = Array.from(
    { length: 50 },
    (): PrivatePaddyInward => {
        const paddyType = faker.helpers.arrayElement(paddyTypeOptions).value
        const weight = faker.number.float({
            min: 20,
            max: 100,
            fractionDigits: 2,
        })

        const paddyWeights = {
            paddyMota: paddyType === 'धान(मोटा)' ? weight : undefined,
            paddyPatla: paddyType === 'धान(पतला)' ? weight : undefined,
            paddySarna: paddyType === 'धान(सरना)' ? weight : undefined,
            paddyMahamaya: paddyType === 'धान(महामाया)' ? weight : undefined,
            paddyRbGold: paddyType === 'धान(RB GOLD)' ? weight : undefined,
        }

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            paddyPurchaseDealNumber: faker.string.alphanumeric(6).toUpperCase(),
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            purchaseType: faker.helpers.arrayElement(paddyPurchaseTypeOptions)
                .value,
            doNumber: faker.string.numeric(6),
            committeeName: faker.company.name(),
            balanceDo: faker.number.float({
                min: 50,
                max: 500,
                fractionDigits: 2,
            }),
            gunnyOption: faker.helpers.arrayElement(gunnyTypeOptions).value,
            gunnyNew: faker.number.int({ min: 0, max: 100 }),
            gunnyOld: faker.number.int({ min: 0, max: 200 }),
            gunnyPlastic: faker.number.int({ min: 0, max: 50 }),
            juteWeight: faker.number.float({
                min: 1,
                max: 10,
                fractionDigits: 2,
            }),
            plasticWeight: faker.number.float({
                min: 0.5,
                max: 5,
                fractionDigits: 2,
            }),
            gunnyWeight: faker.number.float({
                min: 1.5,
                max: 15,
                fractionDigits: 2,
            }),
            truckNumber: `${faker.location.state({
                abbreviated: true,
            })}-${faker.number.int({
                min: 10,
                max: 99,
            })}-${faker.string.alpha({
                length: 2,
                casing: 'upper',
            })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            rstNumber: faker.string.alphanumeric(8).toUpperCase(),
            truckLoadWeight: faker.number.float({
                min: 100,
                max: 300,
                fractionDigits: 2,
            }),
            paddyType,
            ...paddyWeights,
        }
    }
)
