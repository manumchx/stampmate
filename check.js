const fs = require('fs');
const html = fs.readFileSync('public/index.html', 'utf8');
const count = (html.match(/testi-grid/g) || []).length;
console.log('Nombre de testi-grid:', count);
console.log('Index:', html.indexOf('Consumer Study'));
