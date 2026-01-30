import { faker } from '@faker-js/faker'

faker.seed(24680)

export const staff = Array.from({ length: 150 }, () => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const status = faker.helpers.arrayElement([
        'active',
        'inactive',
        'suspended',
    ])

    // Generate attendance history for the current month
    const generateAttendanceHistory = () => {
        if (status !== 'active') return undefined

        const today = new Date()
        const currentMonth = today.getMonth()
        const currentYear = today.getFullYear()
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

        const attendanceHistory = []
        const daysToGenerate = faker.number.int({
            min: Math.max(1, daysInMonth - 25),
            max: daysInMonth,
        })

        for (let i = 0; i < daysToGenerate; i++) {
            const day = i + 1
            const date = new Date(currentYear, currentMonth, day)
            const dateStr = date.toISOString().split('T')[0]

            attendanceHistory.push({
                date: dateStr,
                status: faker.helpers.arrayElement(['P', 'A', 'H']),
            })
        }

        return attendanceHistory
    }

    return {
        id: faker.string.uuid(),
        firstName,
        lastName,
        email: faker.internet.email({ firstName }).toLocaleLowerCase(),
        phoneNumber: faker.phone.number({ style: 'international' }),
        status,
        role: faker.helpers.arrayElement([
            'manager',
            'supervisor',
            'operator',
            'accountant',
        ]),
        attendanceHistory: generateAttendanceHistory(),
        isPaymentDone: faker.datatype.boolean(),
        isMillVerified: faker.datatype.boolean(),
        createdAt: faker.date.past(),
        updatedAt: faker.date.recent(),
    }
})
