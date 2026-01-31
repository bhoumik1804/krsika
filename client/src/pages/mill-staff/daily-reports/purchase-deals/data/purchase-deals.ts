import { faker } from '@faker-js/faker'
import { type PurchaseDeal } from './schema'

faker.seed(23456)

export const purchaseDeals: PurchaseDeal[] = Array.from(
    { length: 50 },
    (): PurchaseDeal => {
        const quantity = faker.number.int({ min: 10, max: 200 })
        const rate = faker.number.int({ min: 2000, max: 4000 })
        const totalAmount = quantity * rate

        return {
            id: faker.string.uuid(),
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            farmerName: faker.person.fullName(),
            commodity: faker.helpers.arrayElement([
                'Paddy (Common)',
                'Paddy (Grade A)',
                'Wheat',
                'Maize',
            ]),
            quantity,
            rate,
            totalAmount,
            status: faker.helpers.arrayElement([
                'pending',
                'completed',
                'cancelled',
            ]),
            vehicleNumber: faker.vehicle.vrm(),
            remarks: faker.lorem.sentence(),
        }
    }
)
