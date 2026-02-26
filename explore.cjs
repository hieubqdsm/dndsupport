const fs = require('fs');
let content = fs.readFileSync('new_spells.txt', 'utf8');

// The file has spells separated by something, let's find the D spells
let dspells = content.match(/\d+\.\s+Delay[\s\S]*?(?=\d+\.\s+[A-Z])/g);
if (dspells) {
    console.log("Found D spells using regex?");
} else {
    // Let's just grab everything from "Control Weather" to "Find Familiar"
    let match = content.match(/30\.\s+Control Weather[\s\S]*?50\.\s+(.*)/);
    if (match) {
        console.log("Found chunk");
    }
}

// Let's just print lines 1000 to 1200
let lines = content.split('\n');
for (let i = 1000; i < 1050; i++) {
    console.log(lines[i]);
}
