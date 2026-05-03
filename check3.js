const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const idx = html.indexOf('Consumer Study');
const idx2 = html.indexOf('5x\n</div>');
const idx3 = html.indexOf('testi-stars');
console.log('Consumer Study trouve:', idx);
console.log('Contexte autour de testi-stars:', html.substring(idx3-5, idx3+50));
