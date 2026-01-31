import { faker } from '@faker-js/faker'
import { type GovtPaddyInward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54333)

export const govtPaddyInwardEntries: GovtPaddyInward[] = Array.from(
    { length: 50 },
    (): GovtPaddyInward => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            doNumber: `DO-${faker.number.int({ min: 1000, max: 9999 })}`,
            committeeName: faker.company.name(),
            truckNumber: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            balanceDo: faker.number.float({
                min: 100,
                max: 1000,
                fractionDigits: 2,
            }),
            gunnyNew: faker.number.int({ min: 0, max: 100 }),
            gunnyOld: faker.number.int({ min: 0, max: 100 }),
            gunnyPlastic: faker.number.int({ min: 0, max: 100 }),
            juteWeight: faker.number.float({
                min: 1,
                max: 10,
                fractionDigits: 2,
            }),
            plasticWeight: faker.number.float({
                min: 0.1,
                max: 5,
                fractionDigits: 2,
            }),
            gunnyWeight: faker.number.float({
                min: 1,
                max: 20,
                fractionDigits: 2,
            }),
            rstNumber: `RST-${faker.number.int({ min: 10000, max: 99999 })}`,
            truckLoadWeight: faker.number.float({
                min: 100,
                max: 500,
                fractionDigits: 2,
            }),
            paddyType: faker.helpers.arrayElement([
                'Mota',
                'Patla',
                'Sarna',
                'Mahamaya',
                'RB Gold',
            ]),
            paddyMota: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
            paddyPatla: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
            paddySarna: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
            paddyMahamaya: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
            paddyRbGold: faker.number.float({
                min: 0,
                max: 100,
                fractionDigits: 2,
            }),
        }
    }
)
