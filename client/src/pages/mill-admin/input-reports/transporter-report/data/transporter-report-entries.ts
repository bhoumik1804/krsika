import { faker } from '@faker-js/faker'
import { type TransporterReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54329)

export const transporterReportEntries: TransporterReportData[] = Array.from(
    { length: 50 },
    (): TransporterReportData => ({
        transporterName: faker.person.fullName(),
        gstn: faker.string.alphanumeric({ length: 15 }).toUpperCase(),
        phone: faker.phone.number({ style: 'international' }),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
    })
)
