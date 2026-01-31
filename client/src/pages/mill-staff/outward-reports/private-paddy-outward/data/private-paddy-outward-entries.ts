import { faker } from '@faker-js/faker'
import { type PrivatePaddyOutward } from './schema'

const paddyTypes = ['मोटी', 'पतली', 'सरेला', 'महामाया', 'RB GOLD']

export const privatePaddyOutwardEntries: PrivatePaddyOutward[] = Array.from(
    { length: 30 },
    () => {
        const gunnyNew = faker.number.int({ min: 0, max: 100 })
        const gunnyOld = faker.number.int({ min: 0, max: 80 })
        const gunnyPlastic = faker.number.int({ min: 0, max: 60 })
        const juteWeight = faker.number.float({
            min: 0,
            max: 50,
            fractionDigits: 2,
        })
        const plasticWeight = faker.number.float({
            min: 0,
            max: 40,
            fractionDigits: 2,
        })
        const truckWeight = faker.number.float({
            min: 500,
            max: 2000,
            fractionDigits: 2,
        })

        // Calculate gunnyWeight (sum of jute and plastic weights)
        const gunnyWeight = parseFloat((juteWeight + plasticWeight).toFixed(2))

        // Calculate netWeight (truck weight minus gunny weight)
        const netWeight = parseFloat((truckWeight - gunnyWeight).toFixed(2))

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            paddySaleDealNumber: `SALE-${faker.number.int({ min: 1000, max: 9999 })}`,
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            paddyType: faker.helpers.arrayElement(paddyTypes),
            doQty: faker.number.float({
                min: 100,
                max: 1000,
                fractionDigits: 2,
            }),
            gunnyNew,
            gunnyOld,
            gunnyPlastic,
            juteWeight,
            plasticWeight,
            truckNumber: `${faker.helpers.arrayElement(['UP', 'MP', 'RJ', 'HR'])}-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alphanumeric({ length: 4, casing: 'upper' })}`,
            rstNumber: `RST${faker.number.int({ min: 1000, max: 9999 })}`,
            truckWeight,
            gunnyWeight,
            netWeight,
        }
    }
)
