import { faker } from '@faker-js/faker'
import { type OtherSales } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54325)

export const otherSalesEntries: OtherSales[] = Array.from(
    { length: 50 },
    (): OtherSales => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            brokerName: faker.helpers.maybe(() => faker.person.fullName(), {
                probability: 0.7,
            }),
            otherSaleName: faker.helpers.arrayElement([
                'Seeds',
                'Fertilizer',
                'Pesticide',
                'Tools',
                'Equipment',
            ]),
            otherSaleQty: faker.number.float({
                min: 10,
                max: 500,
                fractionDigits: 2,
            }),
            qtyType: faker.helpers.arrayElement(['Kg', 'Liter', 'Bag', 'Unit']),
            rate: faker.number.float({
                min: 100,
                max: 2000,
                fractionDigits: 2,
            }),
            discountPercent: faker.number.float({
                min: 0,
                max: 10,
                fractionDigits: 2,
            }),
            gst: faker.helpers.arrayElement([0, 5, 12, 18]),
        }
    }
)
