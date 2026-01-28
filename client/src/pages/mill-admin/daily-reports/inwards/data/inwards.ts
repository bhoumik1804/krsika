import { faker } from '@faker-js/faker'
import { type InwardEntry } from './schema'

faker.seed(45678)

export const inwardEntries: InwardEntry[] = Array.from(
    { length: 50 },
    (): InwardEntry => {
        const bags = faker.number.int({ min: 20, max: 400 })
        const weight = bags * 50 // Approx 50kg per bag

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 7 }).toISOString().split('T')[0],
            gatePassNumber: `GP-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.company.name(),
            item: faker.helpers.arrayElement([
                'Paddy',
                'Rice',
                'Gunny Bags',
                'Maintenance Parts',
                'Chemicals',
            ]),
            vehicleNumber: faker.vehicle.vrm(),
            bags,
            weight,
            driverName: faker.person.fullName(),
            status: faker.helpers.arrayElement([
                'pending',
                'completed',
                'verified',
            ]),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
        }
    }
)
