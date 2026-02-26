const fs = require('fs');
let content = fs.readFileSync('new_spells.txt', 'utf8');
let blocks = content.split(/\?\?\?\?\?\?\?\?\?\?\?\?\?\?\?\?\?|=====================================/);

let spellsToTranslate = [];
let count = 0;

for (let i = 65; i < 90; i++) {
    if (blocks[i] && blocks[i].trim()) {
        let text = blocks[i].trim();
        let lines = text.split('\n');
        let nameMatch = lines[0].match(/^\d+\.\s+(.+)$/);
        let name = nameMatch ? nameMatch[1].trim() : lines[0].trim();
        let vietNameMatch = lines[1] ? lines[1].match(/Tên tiếng Việt:\s+(.+)/) : null;
        let vietName = vietNameMatch ? vietNameMatch[1].trim() : name;

        console.log(name + " -> " + vietName);
    }
}
