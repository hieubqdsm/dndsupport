const fs = require('fs');
const path = require('path');

const logDir = '/Users/hieubq/.gemini/antigravity/brain/5c3de368-b750-4bc0-bc74-a069c2787fbb/.system_generated/logs';
let files = [];
try {
    files = fs.readdirSync(logDir).filter(f => f.endsWith('.json'));
} catch (e) {
    console.log("No logs found at " + logDir);
}

let extractedReplacements = [];

for (const file of files) {
    let data;
    try {
        data = JSON.parse(fs.readFileSync(path.join(logDir, file), 'utf8'));
    } catch (e) { continue; }

    // Look at events
    for (const event of data.events || []) {
        if (event.type === 'tool_call') {
            const call = event.tool_call;
            if (call.name === 'default_api:run_command') {
                const cmd = call.arguments.CommandLine || '';
                const regex = /const replaceStr\w*\s*=\s*`([\s\S]*?)`;/g;
                let match;
                while ((match = regex.exec(cmd)) !== null) {
                    extractedReplacements.push(match[1]);
                }
            }
            if (call.name === 'default_api:write_to_file') {
                const content = call.arguments.CodeContent || '';
                const regex = /const replaceStr\w*\s*=\s*`([\s\S]*?)`;/g;
                let match;
                while ((match = regex.exec(content)) !== null) {
                    extractedReplacements.push(match[1]);
                }
            }
            if (call.name === 'default_api:multi_replace_file_content') {
                const chunks = call.arguments.ReplacementChunks || [];
                for (const chunk of chunks) {
                    if (chunk.ReplacementContent && chunk.ReplacementContent.includes('label: "')) {
                        if (/[àáỏõ...đ]/i.test(chunk.ReplacementContent) || chunk.ReplacementContent.includes('Máu')) {
                            extractedReplacements.push(chunk.ReplacementContent);
                        }
                    }
                }
            }
        }
    }
}

fs.writeFileSync('recovered.txt', extractedReplacements.join('\n'));
console.log('Recovered ' + extractedReplacements.length + ' blocks.');
