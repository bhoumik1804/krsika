import { faker } from '@faker-js/faker'
import { type LabourGroupReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54407)

export const labourGroupReportEntries: LabourGroupReportData[] = Array.from(
    { length: 50 },
    (): LabourGroupReportData => {
        return {
            labourTeamName: `Team ${faker.helpers.arrayElement(['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega'])} - ${faker.number.int({ min: 1, max: 20 })}`,
        }
    }
)
