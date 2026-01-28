import { faker } from '@faker-js/faker'
import { type FrkInward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const frkInwardEntries: FrkInward[] = Array.from(
    { length: 50 },
    (): FrkInward => {
        const gunnyPlastic = faker.number.int({ min: 10, max: 200 })
        // Assume plasticWeight represents some measured weight of the bags, approx 0.15 per bag
        const plasticWeight = faker.number.float({
            min: gunnyPlastic * 0.1,
            max: gunnyPlastic * 0.2,
            fractionDigits: 2,
        })
        const truckWeight = faker.number.float({
            min: 50,
            max: 300,
            fractionDigits: 2,
        })

        // Assume gunnyWeight is the plasticWeight for this calculation
        const gunnyWeight = plasticWeight
        const netWeight = truckWeight - gunnyWeight

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            purchaseDealId: faker.string.alphanumeric(8).toUpperCase(),
            partyName: faker.person.fullName(),
            gunnyPlastic,
            plasticWeight,
            truckNumber: `${faker.location.state({
                abbreviated: true,
            })}-${faker.number.int({
                min: 10,
                max: 99,
            })}-${faker.string.alpha({
                length: 2,
                casing: 'upper',
            })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            rstNumber: faker.string.alphanumeric(8).toUpperCase(),
            truckWeight,
            gunnyWeight,
            netWeight: Number(netWeight.toFixed(2)),
        }
    }
)
