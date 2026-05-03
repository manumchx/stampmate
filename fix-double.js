const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
const first = html.indexOf('<div class="testi-grid">');
const second = html.indexOf('<div class="testi-grid">', first + 1);
if (second !== -1) {
  const endOfSecond = html.indexOf('</div></div></div>', second) + 18;
  html = html.slice(0, second) + html.slice(endOfSecond);
  console.log('Doublon supprime!');
} else {
  console.log('Pas de doublon trouve');
}
fs.writeFileSync('public/index.html', html);
