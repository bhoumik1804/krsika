import { faker } from '@faker-js/faker'
import { type CommitteeReportData } from './schema'
import {committeeTypeOptions} from '@/constants/input-form'

// Set a fixed seed for consistent data generation
faker.seed(54331)

export const committeeReportEntries: CommitteeReportData[] = Array.from(
    { length: 50 },
    (): CommitteeReportData => ({
        committeeType: faker.helpers.arrayElement(committeeTypeOptions).value,
        committeeName: faker.lorem.sentence(),
    })
)
