import { faker } from '@faker-js/faker'
import { type ReceiptEntry } from './schema'

faker.seed(89012)

export const receiptEntries: ReceiptEntry[] = Array.from(
    { length: 50 },
    (): ReceiptEntry => {
        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 20 }).toISOString().split('T')[0],
            voucherNumber: `RCT-${faker.number.int({ min: 10000, max: 99999 })}`,
            partyName: faker.company.name(),
            amount: faker.number.int({ min: 5000, max: 500000 }),
            paymentMode: faker.helpers.arrayElement([
                'Cash',
                'Bank',
                'Cheque',
                'UPI',
            ]),
            purpose: faker.helpers.arrayElement([
                'Bill Payment',
                'Advance',
                'Security Deposit',
                'Misc',
            ]),
            status: faker.helpers.arrayElement(['cleared', 'pending']),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.1,
            }),
        }
    }
)
