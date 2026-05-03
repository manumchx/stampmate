const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace('our paper stamp cards 3 months ago and our repeat customer rate went up by 40%. The QR code does all the work.', '');
html = html.replace('about the loyalty card. They get a notification when close to a reward. Paper cards just sat forgotten. This is different.', '');
html = html.replace('. QR code on counter Tuesday, 23 customers with the card by Friday. The dashboard shows me everything.', '');
const idx1 = html.indexOf('<div class="x">');
while(html.includes('<div class="x">')) {
  const start = html.indexOf('<div class="x">');
  const end = html.indexOf('</div>', start) + 6;
  html = html.slice(0, start) + html.slice(end);
}
fs.writeFileSync('public/index.html', html);
console.log('Nettoye!');
