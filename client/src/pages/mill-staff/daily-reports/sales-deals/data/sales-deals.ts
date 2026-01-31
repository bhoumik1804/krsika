import { faker } from '@faker-js/faker'
import { type SalesDeal } from './schema'

faker.seed(34567)

export const salesDeals: SalesDeal[] = Array.from(
    { length: 50 },
    (): SalesDeal => {
        const quantity = faker.number.int({ min: 50, max: 500 })
        const rate = faker.number.int({ min: 2500, max: 5000 })
        const totalAmount = quantity * rate

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            buyerName: faker.company.name(),
            brokerName: faker.helpers.maybe(() => faker.person.fullName(), {
                probability: 0.7,
            }),
            commodity: faker.helpers.arrayElement([
                'Rice (Basmati)',
                'Rice (Sona Masoori)',
                'Rice (Parboiled)',
                'Broken Rice',
                'Bran',
            ]),
            quantity,
            rate,
            totalAmount,
            status: faker.helpers.arrayElement([
                'pending',
                'completed',
                'cancelled',
            ]),
            paymentTerms: faker.helpers.arrayElement([
                'Cash',
                'Credit 7 Days',
                'Credit 15 Days',
                'Advance',
            ]),
            remarks: faker.lorem.sentence(),
        }
    }
)
