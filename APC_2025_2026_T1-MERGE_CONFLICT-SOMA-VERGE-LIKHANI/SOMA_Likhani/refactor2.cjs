const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filep = path.join(dir, file);
    if (!fs.statSync(filep).isDirectory() && filep.endsWith('.tsx')) {
      results.push(filep);
    } else if (fs.statSync(filep).isDirectory()) {
      results = results.concat(walk(filep));
    }
  });
  return results;
}

const files = walk('C:/Users/Maru/Desktop/Projects/SOMA Projects/SOMA Verge/APC_2025_2026_T1-MERGE_CONFLICT-SOMAVAULT/SOMA_Likhani/src/app');

files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('useCustomTheme') && c.includes('isDark') && !c.includes('isLightsOut')) {
    
    // Replace boolean definition
    c = c.replace(/const isDark\s*=\s*(currentTheme|theme)\s*===\s*["']dark["'];/g, 
      "const isDim = $1 === 'dim';\n  const isLightsOut = $1 === 'lights-out';\n  const isDark = isDim || isLightsOut;");
    
    // Only touch specific background ternaries
    c = c.replace(/isDark\s*\?\s*(["'])([^"']*?)\1\s*:\s*(["'])([^"']*?)\3/g, (match, q1, darkStr, q3, lightStr) => {
      if (darkStr.includes('bg-[#1a1a1a]') || darkStr.includes('bg-[#121212]') || darkStr.includes('bg-[#111111]') || darkStr.includes('bg-[#161616]') || darkStr.includes('bg-[#2a2a2a]')) {
        let blackStr = darkStr.replace(/bg-\[#[a-fA-F0-9]{6}\]/g, 'bg-[#000000]');
        blackStr = blackStr.replace(/bg-\[#2a2a2a\]/g, 'bg-[#111111]').replace(/border-gray-800/g, 'border-gray-900').replace(/divide-gray-800/g, 'divide-gray-900');
        
        return "isLightsOut ? " + q1 + blackStr + q1 + " : isDim ? " + q1 + darkStr + q1 + " : " + q3 + lightStr + q3;
      }
      return match;
    });

    fs.writeFileSync(f, c);
  }
});
console.log("Refactored properly!");
