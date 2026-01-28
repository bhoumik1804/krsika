import { faker } from '@faker-js/faker'
import { type OtherOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54345)

export const otherOutwardEntries: OtherOutward[] = Array.from(
    { length: 50 },
    (): OtherOutward => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            itemSaleDealNumber: `OSD-${faker.number.int({ min: 1000, max: 9999 })}`,
            itemName: faker.helpers.arrayElement([
                'Wheat',
                'Corn',
                'Barley',
                'Oats',
                'Millet',
            ]),
            quantity: faker.number.int({ min: 100, max: 1000 }),
            quantityType: faker.helpers.arrayElement(['Kg', 'Quintal', 'Ton']),
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            gunnyNew: faker.number.int({ min: 0, max: 100 }),
            gunnyOld: faker.number.int({ min: 0, max: 100 }),
            gunnyPlastic: faker.number.int({ min: 0, max: 100 }),
            juteWeight: faker.number.float({
                min: 0.1,
                max: 0.3,
                fractionDigits: 3,
            }),
            plasticWeight: faker.number.float({
                min: 0.1,
                max: 0.2,
                fractionDigits: 3,
            }),
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            truckRst: faker.string.alphanumeric(8).toUpperCase(),
            truckWeight: faker.number.float({
                min: 100,
                max: 500,
                fractionDigits: 2,
            }),
            gunnyWeight: faker.number.float({
                min: 10,
                max: 50,
                fractionDigits: 2,
            }),
            netWeight: faker.number.float({
                min: 80,
                max: 450,
                fractionDigits: 2,
            }),
        }
    }
)
