import { faker } from '@faker-js/faker'
import { type FinancialPayment } from './schema'

// Set a fixed seed for consistent data generation
faker.seed(54339)

const paymentTypes = [
    'सौदे का भुगतान',
    'परिवहन भुगतान',
    'हमाली भुगतान',
    'वेतन/मजदूरी भुगतान',
]
const dealTypes = ['खरीद', 'बिक्री', 'विनिमय']
const partyNames = [
    'राज ट्रेडर्स',
    'अमित एंटरप्राइजेस',
    'भारत अनाज',
    'सिंह ब्रदर्स',
    'पटेल इंडस्ट्रीज',
]
const brokerNames = [
    'राजेश ब्रोकर',
    'अजय कमीशन',
    'संजय डीलर',
    'मोहित एजेंसी',
    'विजय बिज़नेस',
]
const transporterNames = [
    'सिंह ट्रांसपोर्ट',
    'गुप्ता लॉजिस्टिक्स',
    'शर्मा कैरियर्स',
]
const hamalTypes = ['आढ़क हमाली', 'आवक हमाली', 'मिश्रित हमाली', 'अन्य हमाली']
const hamalNames = ['राम हमाल', 'श्याम ग्रुप', 'मोहन टीम', 'सोहन दल']
const staffNames = ['रमेश कुमार', 'सुरेश पटेल', 'दिनेश शर्मा', 'राकेश वर्मा']
const months = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून']

export const FinancialPaymentEntries: FinancialPayment[] = Array.from(
    { length: 50 },
    (_, index): FinancialPayment => {
        const paymentType = faker.helpers.arrayElement(paymentTypes)

        const baseEntry = {
            date: faker.date.recent({ days: 60 }).toISOString().split('T')[0],
            paymentType,
            remarks: faker.helpers.maybe(() => faker.lorem.sentence(), {
                probability: 0.3,
            }),
        }

        if (paymentType === 'सौदे का भुगतान') {
            return {
                ...baseEntry,
                partyName: faker.helpers.arrayElement(partyNames),
                brokerName: faker.helpers.arrayElement(brokerNames),
                purchaseDealType: faker.helpers.arrayElement(dealTypes),
                purchaseDealNumber: String(50000 + index),
                paymentAmount: faker.number.float({
                    min: 50000,
                    max: 500000,
                    fractionDigits: 2,
                }),
            }
        } else if (paymentType === 'परिवहन भुगतान') {
            return {
                ...baseEntry,
                transporterName: faker.helpers.arrayElement(transporterNames),
                truckNumber: `UP-${faker.number.int({ min: 10, max: 99 })}-${faker.string.alpha({ length: 2, casing: 'upper' })}-${faker.number.int({ min: 1000, max: 9999 })}`,
                diesel: faker.number.float({
                    min: 1000,
                    max: 10000,
                    fractionDigits: 2,
                }),
                bhatta: faker.number.float({
                    min: 500,
                    max: 5000,
                    fractionDigits: 2,
                }),
                repairOrMaintenance: faker.number.float({
                    min: 200,
                    max: 2000,
                    fractionDigits: 2,
                }),
                paymentAmount: faker.number.float({
                    min: 10000,
                    max: 100000,
                    fractionDigits: 2,
                }),
            }
        } else if (paymentType === 'हमाली भुगतान') {
            return {
                ...baseEntry,
                labourType: faker.helpers.arrayElement(hamalTypes),
                labourGroupName: faker.helpers.arrayElement(hamalNames),
                paymentAmount: faker.number.float({
                    min: 5000,
                    max: 50000,
                    fractionDigits: 2,
                }),
            }
        } else {
            // वेतन/मजदूरी भुगतान
            const salary = faker.number.float({
                min: 15000,
                max: 50000,
                fractionDigits: 2,
            })
            const attendance = faker.number.int({ min: 20, max: 30 })
            const allowedLeave = faker.number.float({
                min: 0,
                max: 5000,
                fractionDigits: 2,
            })
            const payableSalary = faker.number.float({
                min: salary * 0.8,
                max: salary,
                fractionDigits: 2,
            })

            return {
                ...baseEntry,
                staffName: faker.helpers.arrayElement(staffNames),
                salary,
                month: faker.helpers.arrayElement(months),
                attendance,
                allowedLeave,
                payableSalary,
                salaryPayment: faker.number.float({
                    min: payableSalary * 0.7,
                    max: payableSalary,
                    fractionDigits: 2,
                }),
                advancePayment: faker.number.float({
                    min: 0,
                    max: 10000,
                    fractionDigits: 2,
                }),
                paymentAmount: faker.number.float({
                    min: 20000,
                    max: 60000,
                    fractionDigits: 2,
                }),
            }
        }
    }
)
