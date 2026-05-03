const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const positions = [];
let pos = 0;
while ((pos = html.indexOf('testi-grid', pos)) !== -1) {
  positions.push(pos);
  pos++;
}
console.log('Positions:', positions);
console.log('Contexte 1:', html.substring(positions[0]-20, positions[0]+30));
console.log('Contexte 2:', html.substring(positions[1]-20, positions[1]+30));
