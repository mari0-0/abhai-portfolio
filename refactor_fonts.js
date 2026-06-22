const fs = require('fs');
const path = require('path');

const cssDir = path.join(__dirname, 'src');

const variables = {
  '0.65rem': 'var(--text-xs)',
  '0.7rem': 'var(--text-sm)',
  '0.75rem': 'var(--text-md)',
  '0.8rem': 'var(--text-base)',
  '0.85rem': 'var(--text-lg)',
  '1rem': 'var(--text-xl)',
  '1.15rem': 'var(--text-2xl)',
  '1.2rem': 'var(--text-3xl)',
  '1.4rem': 'var(--text-4xl)',
  '1.5rem': 'var(--text-5xl)',
  '2.4rem': 'var(--text-6xl)',
  '2.5rem': 'var(--text-7xl)',
  '3rem': 'var(--text-8xl)',
  '3.5rem': 'var(--text-9xl)',
  '5rem': 'var(--text-10xl)',
  'clamp(1.4rem, 2.5vw, 2rem)': 'var(--text-fluid-1)',
  'clamp(2.5rem, 12vw, 5rem)': 'var(--text-fluid-2)',
  'clamp(3rem, 8vw, 6rem)': 'var(--text-fluid-3)',
  'clamp(4rem, 10vw, 9rem)': 'var(--text-fluid-4)',
  '3vw': 'var(--text-vw-sm)',
  '7vw': 'var(--text-vw-lg)'
};

const rootCssVars = `
  /* Typography Variables */
  --text-xs: 0.65rem;
  --text-sm: 0.7rem;
  --text-md: 0.75rem;
  --text-base: 0.8rem;
  --text-lg: 0.85rem;
  --text-xl: 1rem;
  --text-2xl: 1.15rem;
  --text-3xl: 1.2rem;
  --text-4xl: 1.4rem;
  --text-5xl: 1.5rem;
  --text-6xl: 2.4rem;
  --text-7xl: 2.5rem;
  --text-8xl: 3rem;
  --text-9xl: 3.5rem;
  --text-10xl: 5rem;
  --text-fluid-1: clamp(1.4rem, 2.5vw, 2rem);
  --text-fluid-2: clamp(2.5rem, 12vw, 5rem);
  --text-fluid-3: clamp(3rem, 8vw, 6rem);
  --text-fluid-4: clamp(4rem, 10vw, 9rem);
  --text-vw-sm: 3vw;
  --text-vw-lg: 7vw;
`;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(cssDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (file.endsWith('globals.css')) {
    if (!content.includes('--text-xs:')) {
      content = content.replace(':root {', ':root {' + rootCssVars);
    }
  }

  // Replace exact matches
  for (const [val, variable] of Object.entries(variables)) {
    // regex to replace exactly "font-size: val;" or "font-size: val"
    // handling possible spaces
    // e.g. font-size: 0.85rem;
    
    // We escape the value for regex
    const escapedVal = val.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`font-size:\\s*${escapedVal}\\s*;?`, 'g');
    content = content.replace(regex, `font-size: ${variable};`);
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log('Updated', file);
});
