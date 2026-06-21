const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements to dial back the "heaviness"
content = content.replace(/rounded-\[32px\]/g, 'rounded-xl');
content = content.replace(/rounded-\[24px\]/g, 'rounded-lg');
content = content.replace(/rounded-2xl/g, 'rounded-md');

content = content.replace(/text-5xl/g, 'text-3xl');
content = content.replace(/text-3xl/g, 'text-xl');
content = content.replace(/text-2xl/g, 'text-lg');
content = content.replace(/text-xl/g, 'text-base');

content = content.replace(/text-\[10px\] font-black uppercase tracking-widest/g, 'text-xs font-medium text-gray-500');
content = content.replace(/font-sans text-\[10px\] font-black uppercase tracking-widest/g, 'text-xs font-medium text-gray-500');
content = content.replace(/font-sans text-\[9px\] font-black uppercase tracking-widest/g, 'text-xs font-medium text-gray-500');
content = content.replace(/font-sans text-xs font-bold uppercase tracking-widest/g, 'text-sm text-gray-500');
content = content.replace(/font-sans text-sm font-bold uppercase tracking-widest/g, 'text-sm text-gray-500');
content = content.replace(/text-xs font-bold uppercase tracking-widest/g, 'text-xs font-medium text-gray-500');
content = content.replace(/font-h font-black uppercase tracking-widest/g, 'font-semibold');
content = content.replace(/font-h font-black uppercase tracking-tight/g, 'font-bold');
content = content.replace(/font-h text-3xl font-black/g, 'text-xl font-semibold');
content = content.replace(/font-h text-2xl font-black/g, 'text-lg font-semibold');
content = content.replace(/font-h text-xl font-black/g, 'text-base font-semibold');
content = content.replace(/font-h font-black/g, 'font-bold');
content = content.replace(/font-black/g, 'font-bold');

content = content.replace(/py-5/g, 'py-2.5');
content = content.replace(/px-10/g, 'px-5');
content = content.replace(/p-10/g, 'p-6');
content = content.replace(/p-8/g, 'p-5');

content = content.replace(/py-4 px-5/g, 'py-2 px-3');
content = content.replace(/px-5 py-4/g, 'px-3 py-2');

content = content.replace(/w-16 h-16/g, 'w-10 h-10');
content = content.replace(/w-20 h-20/g, 'w-12 h-12');
content = content.replace(/w-12 h-12/g, 'w-8 h-8');

content = content.replace(/space-y-10/g, 'space-y-6');
content = content.replace(/space-y-8/g, 'space-y-5');

content = content.replace(/gap-12/g, 'gap-6');
content = content.replace(/gap-10/g, 'gap-5');

content = content.replace(/border-4 border-dashed/g, 'border-2 border-dashed');

// Fix some specific buttons
content = content.replace(/px-8 py-4/g, 'px-4 py-2');
content = content.replace(/px-6 py-4/g, 'px-4 py-2');
content = content.replace(/px-6 py-3/g, 'px-4 py-2');

// Fix sidebar font sizes
content = content.replace(/w-\[280px\]/g, 'w-[240px]');
content = content.replace(/ml-\[280px\]/g, 'ml-[240px]');
content = content.replace(/h-24/g, 'h-16');

fs.writeFileSync(filePath, content, 'utf8');
console.log("Done shrinking Admin Dashboard");
