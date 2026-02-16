const fs = require('fs');
const path = require('path');

const files = [
    'f:/c2d/krsika/client/src/locales/en/mill-staff.json',
    'f:/c2d/krsika/client/src/locales/hi/mill-staff.json'
];

files.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);
        console.log(`Successfully parsed ${path.basename(file)}`);
        const keys = Object.keys(json);
        console.log(`Top-level keys in ${path.basename(file)}:`, keys);
        if (json.balanceLiftingPaddyPurchase) {
            console.log(`Found balanceLiftingPaddyPurchase in ${path.basename(file)}`);
            console.log('Title:', json.balanceLiftingPaddyPurchase.title);
        } else {
            console.error(`MISSING balanceLiftingPaddyPurchase in ${path.basename(file)}`);
            // Check if it's nested deep?
            // Simple check
        }
    } catch (e) {
        console.error(`Error parsing ${path.basename(file)}:`, e.message);
    }
});
