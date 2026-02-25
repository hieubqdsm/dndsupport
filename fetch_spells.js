import fs from 'fs';

async function fetchSpells() {
    const query = `
  {
    spells(limit: 500) {
      name
      level
      school { name }
      casting_time
      range
      components
      material
      duration
      concentration
      ritual
      classes { name }
      desc
    }
  }
  `;

    try {
        const response = await fetch('https://www.dnd5eapi.co/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const json = await response.json();
        if (!json.data || !json.data.spells) {
            console.error("Failed to fetch", json);
            return;
        }
        const spells = json.data.spells;

        const content = fs.readFileSync('data/spells.ts', 'utf-8');
        const existingNames = new Set([...content.matchAll(/name:\s*'([^']+)'/g)].map(m => m[1].toLowerCase()));
        const newSpells = [];

        newSpells.push(`\n    // ===========================`);
        newSpells.push(`    // FULL SRD SPELLS (ENGLISH DUMP)`);
        newSpells.push(`    // ===========================`);

        for (const sp of spells) {
            if (existingNames.has(sp.name.toLowerCase())) continue;

            const compStr = sp.components.join(', ');
            let cleanDesc = sp.desc ? sp.desc.join(' ').replace(/\n/g, " ").replace(/\s\s+/g, ' ') : '';

            // Using JSON.stringify makes it safer to escape strings for JS code embedding
            newSpells.push(`    { name: ${JSON.stringify(sp.name)}, label: ${JSON.stringify(sp.name)}, level: ${sp.level}, school: ${JSON.stringify(sp.school?.name || 'Unknown')}, castingTime: ${JSON.stringify(sp.casting_time)}, range: ${JSON.stringify(sp.range)}, components: ${JSON.stringify(compStr)}, duration: ${JSON.stringify(sp.duration)}, concentration: ${sp.concentration}, ritual: ${sp.ritual}, classes: ${JSON.stringify(sp.classes.map(c => c.name))}, description: ${JSON.stringify(cleanDesc)} },`);
        }

        newSpells.push(`];`);

        fs.writeFileSync('new_spells.txt', newSpells.join('\n'));
        console.log("SUCCESS. Spells missing: " + (newSpells.length - 4));
    } catch (e) {
        console.error(e);
    }
}

fetchSpells();
