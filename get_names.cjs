const fs = require('fs');
const content = fs.readFileSync('new_spells.txt', 'utf8');
const regex = /name:\s*"([^"]+)"/g;
let match;
let i = 0;
while ((match = regex.exec(content)) !== null) {
    if (i >= 25 && i < 45) {
        console.log((i + 1) + ". " + match[1]);
    }
    i++;
}
