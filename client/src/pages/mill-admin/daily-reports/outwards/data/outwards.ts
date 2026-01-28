import { faker } from '@faker-js/faker'
import { type OutwardEntry } from './schema'

faker.seed(56789)

export const outwardEntries: OutwardEntry[] = Array.from(
    { length: 50 },
    (): OutwardEntry => {
        const bags = faker.number.int({ min: 50, max: 600 })
        const weight = bags * 50 // Approx 50kg per bag

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 10 }).toISOString().split('T')[0],
            gatePassNumber: `GP-OUT-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.company.name(),
            item: faker.helpers.arrayElement([
                'Rice (Basmati)',
                'Rice (Sona Masoori)',
                'Bran',
                'Husk',
            ]),
            vehicleNumber: faker.vehicle.vrm(),
            bags,
            weight,
            driverName: faker.person.fullName(),
            status: faker.helpers.arrayElement([
                'pending',
                'completed',
                'dispatched',
            ]),
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.2,
            }),
        }
    }
)
