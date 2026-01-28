import { faker } from '@faker-js/faker'
import { type BrokerReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54330)

export const brokerReportEntries: BrokerReportData[] = Array.from(
    { length: 50 },
    (): BrokerReportData => ({
        brokerName: faker.person.fullName(),
        phone: faker.phone.number({ style: 'human' }),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
    })
)
