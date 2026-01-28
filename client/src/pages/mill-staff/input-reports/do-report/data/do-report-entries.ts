import { faker } from '@faker-js/faker'
import { type DoReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54404)

export const doReportEntries: DoReportData[] = Array.from(
    { length: 50 },
    (): DoReportData => {
        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            samitiSangrahan: faker.helpers.arrayElement([
                'समिति संग्रहण 1',
                'समिति संग्रहण 2',
                'समिति संग्रहण 3',
                'समिति संग्रहण 4',
            ]),
            doNo: `DO-${faker.number.int({ min: 1000, max: 9999 })}`,
            dhanMota: faker.number.float({
                min: 10,
                max: 500,
                fractionDigits: 2,
            }),
            dhanPatla: faker.number.float({
                min: 10,
                max: 400,
                fractionDigits: 2,
            }),
            dhanSarna: faker.number.float({
                min: 5,
                max: 300,
                fractionDigits: 2,
            }),
        }
    }
)
