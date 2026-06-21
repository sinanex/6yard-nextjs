const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? files = files.concat(walkDir(dirPath)) : files.push(dirPath);
    });
    return files;
}

const files = walkDir('./src/app/api').filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Match Capitalized identifiers followed by Mongoose methods
    const mongooseMethods = ['findById', 'findByIdAndUpdate', 'findByIdAndDelete', 'findOne', 'findOneAndDelete', 'findOneAndUpdate', 'find'];
    
    mongooseMethods.forEach(method => {
        const regex = new RegExp(`await ([A-Z][a-zA-Z0-9_]*)\\.${method}\\(`, 'g');
        content = content.replace(regex, `await ($1 as any).${method}(`);
    });

    if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Patched ${file}`);
    }
}
