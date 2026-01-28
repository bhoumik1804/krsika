import { faker } from '@faker-js/faker'
import { type PartyReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54329)

export const partyReportEntries: PartyReportData[] = Array.from(
    { length: 50 },
    (): PartyReportData => ({
        partyName: faker.person.fullName(),
        gstn: faker.string.alphanumeric({ length: 15 }).toUpperCase(),
        phone: faker.phone.number({ style: 'international' }),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
    })
)
