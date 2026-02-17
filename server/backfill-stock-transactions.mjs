/**
 * Backfill Stock Transactions
 * 
 * This script creates stock transactions for ALL existing entries
 * that were created before stock recording was added to the services.
 * 
 * Run: node backfill-stock-transactions.mjs
 */
import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
const dbName = process.env.NODE_ENV === 'production' ? process.env.MONGODB_DATABASE_NAME : process.env.MONGODB_TEST_DATABASE_NAME
if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1) }

await mongoose.connect(MONGODB_URI, { dbName })
console.log('Connected to MongoDB:', dbName)

const db = mongoose.connection.db

// Clear existing stock transactions to avoid duplicates
const deleted = await db.collection('stocktransactions').deleteMany({})
console.log(`Cleared ${deleted.deletedCount} existing stock transactions`)

let totalCreated = 0

async function insert(txn) {
    try {
        await db.collection('stocktransactions').insertOne(txn)
        totalCreated++
    } catch (err) {
        console.error('Insert failed:', err.message, txn)
    }
}

function makeTxn(entry, overrides) {
    return {
        millId: entry.millId,
        date: entry.date,
        createdBy: entry.createdBy || null,
        createdAt: new Date(),
        updatedAt: new Date(),
        __v: 0,
        ...overrides,
    }
}

// ===========================
// PADDY PURCHASE (CREDIT)
// ===========================
const paddyPurchases = await db.collection('paddypurchases').find({}).toArray()
console.log(`PaddyPurchase: ${paddyPurchases.length} entries`)
for (const e of paddyPurchases) {
    if (!e.totalPaddyQty || !e.paddyType) continue
    await insert(makeTxn(e, {
        commodity: 'Paddy', variety: e.paddyType, type: 'CREDIT', action: 'Purchase',
        quantity: e.totalPaddyQty, bags: e.bags || 0,
        refModel: 'PaddyPurchase', refId: e._id,
        remarks: `Purchase from ${e.partyName || 'Party'}`,
    }))
}

// ===========================
// INWARD SERVICES (CREDIT)
// ===========================

// 1. Govt Paddy Inward
const govtPaddyInwards = await db.collection('govtpaddyinwards').find({}).toArray()
console.log(`GovtPaddyInward: ${govtPaddyInwards.length} entries`)
for (const e of govtPaddyInwards) {
    const totalQtl = (e.paddyMota || 0) + (e.paddyPatla || 0) + (e.paddySarna || 0) + (e.paddyMahamaya || 0) + (e.paddyRbGold || 0)
    if (totalQtl <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Paddy', variety: e.paddyType || null, type: 'CREDIT', action: 'Inward',
        quantity: totalQtl, bags: 0,
        refModel: 'GovtPaddyInward', refId: e._id,
        remarks: `Govt Paddy Inward - ${e.committeeName || 'Committee'}`,
    }))
}

// 2. Private Paddy Inward
const privatePaddyInwards = await db.collection('privatepaddyinwards').find({}).toArray()
console.log(`PrivatePaddyInward: ${privatePaddyInwards.length} entries`)
for (const e of privatePaddyInwards) {
    const totalQtl = (e.paddyMota || 0) + (e.paddyPatla || 0) + (e.paddySarna || 0) + (e.paddyMahamaya || 0) + (e.paddyRbGold || 0)
    if (totalQtl <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Paddy', variety: e.paddyType || null, type: 'CREDIT', action: 'Inward',
        quantity: totalQtl, bags: 0,
        refModel: 'PrivatePaddyInward', refId: e._id,
        remarks: `Private Paddy Inward - ${e.partyName || 'Party'}`,
    }))
}

// 3. Rice Inward
const riceInwards = await db.collection('riceinwards').find({}).toArray()
console.log(`RiceInward: ${riceInwards.length} entries`)
for (const e of riceInwards) {
    const qty = (e.riceMotaNetWeight || 0) + (e.ricePatlaNetWeight || 0)
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Rice', variety: e.riceType || null, type: 'CREDIT', action: 'Inward',
        quantity: qty / 100, bags: 0,
        refModel: 'RiceInward', refId: e._id,
        remarks: `Rice Inward - ${e.partyName || 'Party'}`,
    }))
}

// 4. FRK Inward
const frkInwards = await db.collection('frkinwards').find({}).toArray()
console.log(`FrkInward: ${frkInwards.length} entries`)
for (const e of frkInwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'FRK', variety: null, type: 'CREDIT', action: 'Inward',
        quantity: qty / 100, bags: 0,
        refModel: 'FrkInward', refId: e._id,
        remarks: `FRK Inward - ${e.partyName || 'Party'}`,
    }))
}

// 5. Gunny Inward
const gunnyInwards = await db.collection('gunnyinwards').find({}).toArray()
console.log(`GunnyInward: ${gunnyInwards.length} entries`)
for (const e of gunnyInwards) {
    const totalBags = (e.gunnyNew || 0) + (e.gunnyOld || 0) + (e.gunnyPlastic || 0)
    if (totalBags <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Gunny', variety: null, type: 'CREDIT', action: 'Inward',
        quantity: totalBags, bags: totalBags,
        refModel: 'GunnyInward', refId: e._id,
        remarks: `Gunny Inward - ${e.partyName || 'Party'}`,
    }))
}

// 6. Other Inward
const otherInwards = await db.collection('otherinwards').find({}).toArray()
console.log(`OtherInward: ${otherInwards.length} entries`)
for (const e of otherInwards) {
    const qty = e.netWeight ? e.netWeight / 100 : (e.quantity || 0)
    if (qty <= 0 || !e.itemName) continue
    await insert(makeTxn(e, {
        commodity: e.itemName, variety: null, type: 'CREDIT', action: 'Inward',
        quantity: qty, bags: 0,
        refModel: 'OtherInward', refId: e._id,
        remarks: `Other Inward - ${e.partyName || 'Party'}`,
    }))
}

// ===========================
// OUTWARD SERVICES (DEBIT)
// ===========================

// 1. Govt Rice Outward
const govtRiceOutwards = await db.collection('govtriceoutwards').find({}).toArray()
console.log(`GovtRiceOutward: ${govtRiceOutwards.length} entries`)
for (const e of govtRiceOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Rice', variety: e.riceType || null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: (e.gunnyNew || 0) + (e.gunnyOld || 0),
        refModel: 'GovtRiceOutward', refId: e._id,
        remarks: `Govt Rice Outward - Lot ${e.lotNo || 'N/A'}`,
    }))
}

// 2. Private Rice Outward
const privateRiceOutwards = await db.collection('privatericeoutwards').find({}).toArray()
console.log(`PrivateRiceOutward: ${privateRiceOutwards.length} entries`)
for (const e of privateRiceOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Rice', variety: e.riceType || null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'PrivateRiceOutward', refId: e._id,
        remarks: `Private Rice Outward - ${e.partyName || 'Party'}`,
    }))
}

// 3. FRK Outward
const frkOutwards = await db.collection('frkoutwards').find({}).toArray()
console.log(`FrkOutward: ${frkOutwards.length} entries`)
for (const e of frkOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'FRK', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'FrkOutward', refId: e._id,
        remarks: `FRK Outward`,
    }))
}

// 4. Govt Gunny Outward
const govtGunnyOutwards = await db.collection('govtgunnyoutwards').find({}).toArray()
console.log(`GovtGunnyOutward: ${govtGunnyOutwards.length} entries`)
for (const e of govtGunnyOutwards) {
    const totalBags = (e.oldGunnyQty || 0) + (e.plasticGunnyQty || 0)
    if (totalBags <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Gunny', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: totalBags, bags: totalBags,
        refModel: 'GovtGunnyOutward', refId: e._id,
        remarks: `Govt Gunny Outward - Lot ${e.lotNo || 'N/A'}`,
    }))
}

// 5. Private Gunny Outward
const privateGunnyOutwards = await db.collection('privategunnyoutwards').find({}).toArray()
console.log(`PrivateGunnyOutward: ${privateGunnyOutwards.length} entries`)
for (const e of privateGunnyOutwards) {
    const totalBags = (e.newGunnyQty || 0) + (e.oldGunnyQty || 0) + (e.plasticGunnyQty || 0)
    if (totalBags <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Gunny', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: totalBags, bags: totalBags,
        refModel: 'PrivateGunnyOutward', refId: e._id,
        remarks: `Private Gunny Outward - ${e.partyName || 'Party'}`,
    }))
}

// 6. Private Paddy Outward
const privatePaddyOutwards = await db.collection('privatepaddyoutwards').find({}).toArray()
console.log(`PrivatePaddyOutward: ${privatePaddyOutwards.length} entries`)
for (const e of privatePaddyOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Paddy', variety: e.paddyType || null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'PrivatePaddyOutward', refId: e._id,
        remarks: `Private Paddy Outward - ${e.partyName || 'Party'}`,
    }))
}

// 7. Bhusa Outward
const bhusaOutwards = await db.collection('bhusaoutwards').find({}).toArray()
console.log(`BhusaOutward: ${bhusaOutwards.length} entries`)
for (const e of bhusaOutwards) {
    const qty = e.truckWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Bhusa', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'BhusaOutward', refId: e._id,
        remarks: `Bhusa Outward - ${e.partyName || 'Party'}`,
    }))
}

// 8. Khanda Outward
const khandaOutwards = await db.collection('khandaoutwards').find({}).toArray()
console.log(`KhandaOutward: ${khandaOutwards.length} entries`)
for (const e of khandaOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Khanda', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'KhandaOutward', refId: e._id,
        remarks: `Khanda Outward - ${e.partyName || 'Party'}`,
    }))
}

// 9. Kodha Outward
const kodhaOutwards = await db.collection('kodhaoutwards').find({}).toArray()
console.log(`KodhaOutward: ${kodhaOutwards.length} entries`)
for (const e of kodhaOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Kodha', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'KodhaOutward', refId: e._id,
        remarks: `Kodha Outward - ${e.partyName || 'Party'}`,
    }))
}

// 10. Nakkhi Outward
const nakkhiOutwards = await db.collection('nakkhioutwards').find({}).toArray()
console.log(`NakkhiOutward: ${nakkhiOutwards.length} entries`)
for (const e of nakkhiOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Nakkhi', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'NakkhiOutward', refId: e._id,
        remarks: `Nakkhi Outward - ${e.partyName || 'Party'}`,
    }))
}

// 11. Silky Kodha Outward
const silkyKodhaOutwards = await db.collection('silkykodhaoutwards').find({}).toArray()
console.log(`SilkyKodhaOutward: ${silkyKodhaOutwards.length} entries`)
for (const e of silkyKodhaOutwards) {
    const qty = e.netWeight || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Silky Kodha', variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty / 100, bags: 0,
        refModel: 'SilkyKodhaOutward', refId: e._id,
        remarks: `Silky Kodha Outward - ${e.partyName || 'Party'}`,
    }))
}

// 12. Other Outward
const otherOutwards = await db.collection('otheroutwards').find({}).toArray()
console.log(`OtherOutward: ${otherOutwards.length} entries`)
for (const e of otherOutwards) {
    const qty = e.netWeight ? e.netWeight / 100 : (e.quantity || 0)
    if (qty <= 0 || !e.itemName) continue
    await insert(makeTxn(e, {
        commodity: e.itemName, variety: null, type: 'DEBIT', action: 'Outward',
        quantity: qty, bags: 0,
        refModel: 'OtherOutward', refId: e._id,
        remarks: `Other Outward - ${e.partyName || 'Party'}`,
    }))
}

// ===========================
// MILLING SERVICES (DEBIT)
// ===========================

// Milling Paddy
const millingPaddys = await db.collection('millingpaddies').find({}).toArray()
console.log(`MillingPaddy: ${millingPaddys.length} entries`)
for (const e of millingPaddys) {
    const qty = e.hopperInQintal || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Paddy', variety: e.paddyType || null, type: 'DEBIT', action: 'Milling',
        quantity: qty, bags: 0,
        refModel: 'MillingPaddy', refId: e._id,
        remarks: `Milling Paddy - ${e.shift || 'shift'}`,
    }))
}

// Milling Rice
const millingRices = await db.collection('millingrices').find({}).toArray()
console.log(`MillingRice: ${millingRices.length} entries`)
for (const e of millingRices) {
    const qty = e.hopperInQintal || 0
    if (qty <= 0) continue
    await insert(makeTxn(e, {
        commodity: 'Rice', variety: e.riceType || null, type: 'DEBIT', action: 'Milling',
        quantity: qty, bags: 0,
        refModel: 'MillingRice', refId: e._id,
        remarks: `Milling Rice - ${e.shift || 'shift'}`,
    }))
}

console.log(`\n=== DONE ===`)
console.log(`Total stock transactions created: ${totalCreated}`)

// Show summary by action
const summary = await db.collection('stocktransactions').aggregate([
    { $group: { _id: '$action', count: { $sum: 1 } } }
]).toArray()
for (const s of summary) {
    console.log(`  ${s._id}: ${s.count}`)
}

await mongoose.disconnect()
console.log('Disconnected from MongoDB')
