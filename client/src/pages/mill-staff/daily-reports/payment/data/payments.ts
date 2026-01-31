import { faker } from '@faker-js/faker'
import { type PaymentEntry } from './schema'

faker.seed(90123)

export const paymentEntries: PaymentEntry[] = Array.from(
    { length: 45 },
    (): PaymentEntry => {
        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 15 }).toISOString().split('T')[0],
            voucherNumber: `PAY-${faker.number.int({ min: 10000, max: 99999 })}`,
            partyName: faker.company.name(),
            amount: faker.number.int({ min: 1000, max: 200000 }),
            paymentMode: faker.helpers.arrayElement([
                'Cash',
                'Bank',
                'Cheque',
                'UPI',
            ]),
            purpose: faker.helpers.arrayElement([
                'Vendor Payment',
                'Salary',
                'Electricity Bill',
                'Rent',
                'Misc Expense',
            ]),
            referenceNumber: faker.helpers.maybe(
                () => faker.finance.transactionDescription(),
                { probability: 0.7 }
            ),
            status: faker.helpers.arrayElement(['completed', 'pending']),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.1,
            }),
        }
    }
)
