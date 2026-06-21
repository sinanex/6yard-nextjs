const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) walk(dirPath, callback);
    else callback(dirPath);
  });
};

walk('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // components
  content = content.replace(/import \{ Link, useLocation \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { usePathname } from 'next/navigation';");
  content = content.replace(/const location = useLocation\(\);/g, "const pathname = usePathname();");
  content = content.replace(/location\.pathname/g, "pathname");

  // page.tsx & checkout
  content = content.replace(/navigate\(`([^`]+)`\)/g, "navigate.push(`$1`)");
  content = content.replace(/navigate\('([^']+)'\)/g, "navigate.push('$1')");
  if (filePath.includes('checkout/page.tsx')) {
     if (!content.includes('import { useEffect')) {
         content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
     }
  }

  // route.ts
  if (filePath.includes('route.ts')) {
     content = content.replace(/user\.password\)/g, "(user as any).password)");
  }

  // admin dashboard
  if (filePath.includes('admin/dashboard/page.tsx')) {
     content = content.replace(/useState\(null\)/g, "useState<any>(null)");
     content = content.replace(/\(options, value, onChange\)/g, "(options: any, value: any, onChange: any)");
     content = content.replace(/\(event\)/g, "(event: any)");
     content = content.replace(/\(option\)/g, "(option: any)");
     content = content.replace(/\(option, index\)/g, "(option: any, index: any)");
     content = content.replace(/\(option, idx\)/g, "(option: any, idx: any)");
     content = content.replace(/\(index, name, value\)/g, "(index: any, name: any, value: any)");
     content = content.replace(/\(e\)/g, "(e: any)");
     content = content.replace(/\(id\)/g, "(id: any)");
     content = content.replace(/\(categoryId, subName\)/g, "(categoryId: any, subName: any)");
     content = content.replace(/\(index, e\)/g, "(index: any, e: any)");
     content = content.replace(/\(index, slotIndex, e\)/g, "(index: any, slotIndex: any, e: any)");
     content = content.replace(/\(index, slotIndex\)/g, "(index: any, slotIndex: any)");
     content = content.replace(/\(val\)/g, "(val: any)");
     content = content.replace(/\(selectedColorsArray\)/g, "(selectedColorsArray: any)");
     content = content.replace(/\(sub, i\)/g, "(sub: any, i: any)");
     content = content.replace(/setActiveTab\('new'\)/g, "setActiveTab('new' as any)");
     content = content.replace(/tempImages: \[\]/g, "tempImages: [] as any[]");
     content = content.replace(/existingImages: \[\]/g, "existingImages: [] as any[]");
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
});
