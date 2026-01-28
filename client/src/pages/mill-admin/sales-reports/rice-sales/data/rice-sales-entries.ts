import { faker } from '@faker-js/faker'
import { type RiceSales } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54326)

export const riceSalesEntries: RiceSales[] = Array.from(
    { length: 50 },
    (): RiceSales => {
        const lotOrOtherOptions = ['LOT खरीदी', 'अन्य']
        const fciOrNANOptions = ['FCI', 'NAN']
        const riceTypeOptions = ['बासमती', 'सफेद चावल', 'लाल चावल']
        const deliveryTypeOptions = ['स्वयं ढुलाई', 'क्रेता ढुलाई']
        const frkTypeOptions = ['FRK साहित', 'FRK रहित']
        const gunnyTypeOptions = ['रहित', 'साहित (भाव में)']

        const lotOrOther = faker.helpers.arrayElement(lotOrOtherOptions)
        const isLotSale = lotOrOther === lotOrOtherOptions[0]

        return {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            partyName: faker.person.fullName(),
            brokerName: faker.person.fullName(),
            deliveryType: faker.helpers.arrayElement(deliveryTypeOptions),
            lotOrOther,
            fciOrNAN: isLotSale ? faker.helpers.arrayElement(fciOrNANOptions) : undefined,
            riceType: faker.helpers.arrayElement(riceTypeOptions),
            riceQty: faker.number.float({
                min: 10,
                max: 500,
                fractionDigits: 2,
            }),
            riceRatePerQuintal: faker.number.float({
                min: 2000,
                max: 3500,
                fractionDigits: 2,
            }),
            discountPercent: faker.number.float({
                min: 0,
                max: 10,
                fractionDigits: 2,
            }),
            brokeragePerQuintal: faker.number.float({
                min: 10,
                max: 50,
                fractionDigits: 2,
            }),
            frkType: isLotSale ? faker.helpers.arrayElement(frkTypeOptions) : undefined,
            frkRatePerQuintal: isLotSale && faker.datatype.boolean() ? faker.number.float({
                min: 5,
                max: 20,
                fractionDigits: 2,
            }) : undefined,
            lotNumber: isLotSale ? faker.string.numeric(6) : undefined,
            gunnyType: faker.helpers.arrayElement(gunnyTypeOptions),
            newGunnyRate: faker.number.float({
                min: 5,
                max: 15,
                fractionDigits: 2,
            }),
            oldGunnyRate: faker.number.float({
                min: 2,
                max: 8,
                fractionDigits: 2,
            }),
            plasticGunnyRate: faker.number.float({
                min: 3,
                max: 10,
                fractionDigits: 2,
            }),
        }
    }
)
