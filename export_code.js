const fs = require('fs');
const path = require('path');

// Folders to completely ignore so the file doesn't get too large
const IGNORE_DIRS = ['node_modules', '.next', 'out', 'public', '.git', 'images'];

// Only grab actual code and config files
const ALLOWED_EXTS = ['.js', '.jsx', '.ts', '.tsx', '.css'];
const EXACT_FILES = ['package.json', 'tailwind.config.js', 'next.config.js', 'Product.json'];
const OUTPUT_FILE = 'my_entire_codebase.txt';

let outputStr = '=== NEXT.JS PROJECT CODEBASE ===\n\n';

function crawlDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!IGNORE_DIRS.includes(file)) {
                crawlDirectory(fullPath);
            }
        } else {
            const ext = path.extname(file);

            // Check if it's an allowed extension OR one of our exact requested files
            if ((ALLOWED_EXTS.includes(ext) || EXACT_FILES.includes(file)) && file !== 'package-lock.json') {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    outputStr += `\n\n/******************************************************************\n`;
                    outputStr += ` * FILE: ${fullPath}\n`;
                    outputStr += ` ******************************************************************/\n\n`;
                    outputStr += content;
                } catch (err) {
                    console.error(`Could not read ${file}`);
                }
            }
        }
    }
}

console.log('Crawling project files...');
crawlDirectory('./');
fs.writeFileSync(OUTPUT_FILE, outputStr);
console.log(`Success! Your code has been combined into ${OUTPUT_FILE}`);