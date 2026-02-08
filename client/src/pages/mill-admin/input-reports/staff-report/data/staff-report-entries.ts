import { faker } from '@faker-js/faker'
import { type StaffReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54406)

export const staffReportEntries: StaffReportData[] = Array.from(
    { length: 50 },
    (): StaffReportData => {
        return {
            fullName: faker.person.fullName(),
            post: faker.helpers.arrayElement([
                'Manager',
                'Supervisor',
                'Operator',
                'Clerk',
                'Helper',
            ]),
            salary: faker.number.float({
                min: 15000,
                max: 80000,
                fractionDigits: 2,
            }),
            phone: faker.phone.number(),
            email: faker.internet.email(),
            address: faker.location.streetAddress(),
        }
    }
)
