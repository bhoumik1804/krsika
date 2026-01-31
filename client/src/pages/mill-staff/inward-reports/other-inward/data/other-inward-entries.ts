import { faker } from '@faker-js/faker'
import { type OtherInward } from './schema'

export const otherInwardEntries: OtherInward[] = Array.from({
    length: 20,
}).map(() => {
    faker.seed(Math.random() * 100000)

    // Generate weights
    const truckWeight = faker.number.float({
        min: 10,
        max: 20,
        fractionDigits: 2,
    })
    const juteWeight = faker.number.float({
        min: 0.1,
        max: 0.5,
        fractionDigits: 2,
    })
    const plasticWeight = faker.number.float({
        min: 0.05,
        max: 0.2,
        fractionDigits: 2,
    })

    // Calculate derived weights
    const gunnyWeight = Number((juteWeight + plasticWeight).toFixed(2))
    const netWeight = Number((truckWeight - gunnyWeight).toFixed(2))

    return {
        date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
        purchaseDealId: `OD/${faker.number.int({ min: 1000, max: 9999 })}`,
        itemName: faker.commerce.productName(),
        quantity: faker.number.float({ min: 1, max: 100, fractionDigits: 2 }),
        quantityType: faker.helpers.arrayElement([
            'Kg',
            'Quintal',
            'Ton',
            'Nag',
        ]),
        partyName: faker.company.name(),
        brokerName: faker.person.fullName(),
        gunnyNew: faker.number.int({ min: 0, max: 50 }),
        gunnyOld: faker.number.int({ min: 0, max: 50 }),
        gunnyPlastic: faker.number.int({ min: 0, max: 50 }),
        juteWeight,
        plasticWeight,
        truckNumber: `CG ${faker.number.int({ min: 10, max: 99 })} ${faker.string.alpha(2).toUpperCase()} ${faker.number.int({ min: 1000, max: 9999 })}`,
        rstNumber: faker.string.numeric(6),
        truckWeight,
        gunnyWeight,
        netWeight,
    }
})
