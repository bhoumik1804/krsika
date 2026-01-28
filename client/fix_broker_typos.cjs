const fs = require('fs');
const path = require('path');

const targetDir = path.resolve('d:\\Code2DBug\\mill-project\\client\\src\\pages\\mill-admin\\transaction-reports\\broker');

function traverseAndFix(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            traverseAndFix(fullPath);
        } else {
            // Fix Content
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content.replace(/trasaction/g, 'transaction');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated content in: ${file}`);
            }

            // Fix Filename
            if (file.includes('trasaction')) {
                const newName = file.replace('trasaction', 'transaction');
                const newPath = path.join(dir, newName);
                fs.renameSync(fullPath, newPath);
                console.log(`Renamed: ${file} -> ${newName}`);
            }
        }
    }
}

console.log('Starting typo fix in:', targetDir);
try {
    traverseAndFix(targetDir);
    console.log('Typo fix completed successfully.');
} catch (error) {
    console.error('Error fixing typos:', error);
}
