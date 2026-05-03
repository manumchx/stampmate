const fs = require('fs');
let html = fs.readFileSync('public/index.html', 'utf8');
const start = html.indexOf('<div style="background:#f8f9ff;padding:80px 40px">');
const end = html.lastIndexOf('</div></div></div>') + 18;
const newSection = '<div style="background:#f8f9ff;padding:80px 40px"><div style="max-width:1100px;margin:0 auto"><p class="section-label">Industry Data</p><h2 style="font-size:40px;font-weight:800;margin-bottom:50px">What the data says about digital loyalty</h2><div class="testi-grid"><div class="testi" style="text-align:center;padding:40px 30px"><div style="font-size:64px;font-weight:800;color:#667eea;margin-bottom:15px">40%</div><p style="font-size:15px;color:#444;line-height:1.6">More repeat customer visits with digital loyalty cards vs paper stamp cards</p></div><div class="testi" style="text-align:center;padding:40px 30px"><div style="font-size:64px;font-weight:800;color:#667eea;margin-bottom:15px">5x</div><p style="font-size:15px;color:#444;line-height:1.6">Higher engagement with digital wallet cards vs traditional paper loyalty programs</p></div><div class="testi" style="text-align:center;padding:40px 30px"><div style="font-size:64px;font-weight:800;color:#667eea;margin-bottom:15px">30%</div><p style="font-size:15px;color:#444;line-height:1.6">Average increase in customer spending when a loyalty program is active</p></div></div></div></div>';
html = html.slice(0, start) + newSection + html.slice(end);
fs.writeFileSync('public/index.html', html);
console.log('DONE');
