const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
html = html.replace('<div style="font-size:32px;color:#FFD700">30%</div>', '');
html = html.replace('<div style="font-size:15px;font-style:italic;color:#444;line-height:1.6;margin-bottom:15px">Average increase in customer spending when a loyalty program is active — Australian retail and hospitality data.</div>', '');
html = html.replace('<div class="author"><div class="avatar" style="background:#764ba2">★</div><div><div class="aname">Market Analysis</div><div class="arole">Australian Loyalty Program Benchmarks</div></div></div>', '');
fs.writeFileSync('public/index.html', html);
console.log('Nettoye!');
