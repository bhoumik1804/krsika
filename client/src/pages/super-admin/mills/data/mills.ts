import { faker } from '@faker-js/faker'

// Set a fixed seed for consistent data generation
faker.seed(12345)

export const mills = Array.from({ length: 50 }, () => {
    const millName = faker.company.name() + ' Mill'
    return {
        id: faker.string.uuid(),
        name: millName,
        location: faker.location.city() + ', ' + faker.location.state(),
        capacity: faker.number.int({ min: 100, max: 5000 }) + ' tons/day',
        type: faker.helpers.arrayElement(['rice', 'flour', 'oil', 'combined']),
        status: faker.helpers.arrayElement([
            'active',
            'inactive',
            'maintenance',
            'closed',
        ]),
        manager: faker.person.fullName(),
        phoneNumber: faker.phone.number({ style: 'international' }),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }
})
