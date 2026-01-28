import { faker } from '@faker-js/faker'
import { type VehicleReportData } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54405)

export const vehicleReportEntries: VehicleReportData[] = Array.from(
    { length: 50 },
    (): VehicleReportData => {
        return {
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        }
    }
)
