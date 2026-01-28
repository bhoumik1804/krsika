import { faker } from '@faker-js/faker'
import { type PrivateRiceOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54340)

const riceTypes = ['Basmati', 'Sona Masoori', 'IR-64', 'Swarna', 'Kolam']

export const privateRiceOutwardEntries: PrivateRiceOutward[] = Array.from(
    { length: 50 },
    (): PrivateRiceOutward => {
        const gunnyNew = faker.number.int({ min: 50, max: 300 })
        const gunnyOld = faker.number.int({ min: 20, max: 200 })
        const gunnyPlastic = faker.number.int({ min: 10, max: 100 })
        const juteWeight = faker.number.float({
            min: 5.5,
            max: 12.0,
            fractionDigits: 2,
        })
        const plasticWeight = faker.number.float({
            min: 3.0,
            max: 8.0,
            fractionDigits: 2,
        })
        const trkWt = faker.number.float({
            min: 5000,
            max: 15000,
            fractionDigits: 2,
        })
        const gunnyWt = faker.number.float({
            min: 200,
            max: 800,
            fractionDigits: 2,
        })
        const finalWt = faker.number.float({
            min: trkWt - gunnyWt - 100,
            max: trkWt - gunnyWt,
            fractionDigits: 2,
        })

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            chawalAutoNumber: `CSA-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            lotNo: `LOT-${faker.number.int({ min: 1000, max: 9999 })}`,
            fciNan: faker.helpers.arrayElement(['FCI', 'NAN']),
            riceType: faker.helpers.arrayElement(riceTypes),
            riceQty: faker.number.float({
                min: 500,
                max: 2000,
                fractionDigits: 2,
            }),
            gunnyNew,
            gunnyOld,
            gunnyPlastic,
            juteWeight,
            plasticWeight,
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            truckRst: `RST-${faker.number.int({ min: 10000, max: 99999 })}`,
            trkWt,
            gunnyWt,
            finalWt,
        }
    }
)
