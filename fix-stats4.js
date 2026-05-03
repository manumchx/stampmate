const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
const oldSection = html.match(/<div class="testi-grid">[\s\S]*?<\/div><\/div><\/div>/)[0];
const newSection = `<div class="testi-grid">
<div class="testi" style="text-align:center;padding:40px 30px">
<div style="font-size:64px;font-weight:800;color:#667eea;margin-bottom:15px">40%</div>
<div style="font-size:15px;color:#444;line-height:1.6">More repeat customer visits reported by venues using digital loyalty cards vs paper stamp cards</div>
</div>
<div class="testi" style="text-align:center;padding:40px 30px">
<div style="font-size:64px;font-weight:800;color:#667eea;margin-bottom:15px">5x</div>
<div style="font-size:15px;color:#444;line-height:1.6">Higher customer engagement with digital wallet cards compared to traditional paper loyalty programs</div>
</div>
<div class="testi" style="text-align:center;padding:40px 30px">
<div style="font-size:64px;font-weight:800;color:#667eea;margin-bottom:15px">30%</div>
<div style="font-size:15px;color:#444;line-height:1.6">Average increase in customer spending when a loyalty program is active in Australian hospitality venues</div>
</div>
</div>`;
html = html.replace(/<div class="testi-grid">[\s\S]*?<\/div><\/div><\/div>/, newSection);
fs.writeFileSync('public/index.html', html);
console.log('Stats redesignees!');
