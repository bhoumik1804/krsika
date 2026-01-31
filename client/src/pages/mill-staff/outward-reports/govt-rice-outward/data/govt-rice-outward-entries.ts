import { faker } from '@faker-js/faker'
import { type GovtRiceOutward } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54339)

const riceTypes = ['Basmati', 'Sona Masoori', 'IR-64', 'Swarna', 'Kolam']

export const govtRiceOutwardEntries: GovtRiceOutward[] = Array.from(
    { length: 50 },
    (): GovtRiceOutward => {
        const gunnyNew = faker.number.int({ min: 50, max: 300 })
        const gunnyOld = faker.number.int({ min: 20, max: 200 })
        const juteWeight = faker.number.float({
            min: 5.5,
            max: 12.0,
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
            lotNo: `LOT-${faker.number.int({ min: 1000, max: 9999 })}`,
            fciNan: faker.helpers.arrayElement(['FCI', 'NAN']),
            riceType: faker.helpers.arrayElement(riceTypes),
            gunnyNew,
            gunnyOld,
            juteWeight,
            truckNo: `${faker.location.state({ abbreviated: true })}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
            truckRst: `RST-${faker.number.int({ min: 10000, max: 99999 })}`,
            truckWeight: trkWt,
            gunnyWeight: gunnyWt,
            netWeight: finalWt,
        }
    }
)
