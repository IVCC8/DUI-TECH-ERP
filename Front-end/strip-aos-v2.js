const fs = require('fs');
const path = 'C:\\Users\\ianva\\Documents\\Dui Tech\\Front-end\\dui-tech-erp\\src\\pages\\RH\\RH.jsx';
let content = fs.readFileSync(path, 'utf8');
// Replace all data-aos variants
content = content.replace(/\s?data-aos="[^"]*"/g, '');
fs.writeFileSync(path, content);
console.log('Stripped all data-aos successfully');
