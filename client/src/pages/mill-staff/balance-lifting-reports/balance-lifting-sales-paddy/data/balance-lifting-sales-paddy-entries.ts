import { BalanceLiftingSalesPaddy } from './schema'
import { faker } from '@faker-js/faker'
import {dhanTypeOptions,deliveryTypeOptions,gunnyTypeOptions, paddySaleTypeOptions} from '@/constants/sale-form'

faker.seed(42)

export const balanceLiftingSalesPaddyData: BalanceLiftingSalesPaddy[] = Array.from({ length: 20 }, () => {
    const saleType = paddySaleTypeOptions[faker.number.int({ min: 0, max: 1 })].value
    const dhanTypeOption = dhanTypeOptions.map((opt) => opt.value)
    const deliveryTypeOption = deliveryTypeOptions.map((opt) => opt.value)
    const gunnyTypeOption = gunnyTypeOptions.map((opt) => opt.value)

    return {
        date: faker.date
            .between({
                from: new Date('2024-01-01'),
                to: new Date('2025-12-31'),
            })
            .toISOString()
            .split('T')[0],
        partyName: faker.company.name(),
        brokerName: faker.person.firstName() + ' Broker',
        saleType,
        doNumber: saleType === 'DO बिक्री' ? faker.string.numeric(6) : undefined,
        dhanMotaQty: saleType === 'DO बिक्री' ? faker.number.float({ min: 10, max: 500}) : undefined,
        dhanPatlaQty: saleType === 'DO बिक्री' ? faker.number.float({ min: 10, max: 500}) : undefined,
        dhanSarnaQty: saleType === 'DO बिक्री' ? faker.number.float({ min: 5, max: 300}) : undefined,
        dhanType: faker.helpers.arrayElement(dhanTypeOption),
        dhanQty: faker.number.float({ min: 50, max: 1000}),
        paddyRatePerQuintal: faker.number.float({ min: 2000, max: 3500}),
        deliveryType: faker.helpers.arrayElement(deliveryTypeOption),
        discountPercent: faker.number.float({ min: 0, max: 10 }),
        brokerage: faker.number.float({ min: 10, max: 100  }),
        gunnyType: faker.helpers.arrayElement(gunnyTypeOption),
        newGunnyRate: faker.number.float({ min: 30, max: 80 }),
        oldGunnyRate: faker.number.float({ min: 15, max: 50}),
        plasticGunnyRate: faker.number.float({ min: 10, max: 40 }),
    }
})
