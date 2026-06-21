const fs = require('fs');
const path = require('path');

const pagesDir = '../frontend/src/pages';
const appDir = './src/app';

const routes = {
  'Home.tsx': '',
  'ProductDetail.tsx': 'product/[id]',
  'Cart.tsx': 'cart',
  'Checkout.tsx': 'checkout',
  'Profile.tsx': 'profile',
  'Orders.tsx': 'orders',
  'TrackOrder.tsx': 'track/[id]',
  'PaymentMethod.tsx': 'payments',
  'ShippingAddresses.tsx': 'addresses',
  'Settings.tsx': 'settings',
  'Success.tsx': 'success',
  'AdminLogin.tsx': 'admin',
  'AdminDashboard.tsx': 'admin/dashboard'
};

if (!fs.existsSync(appDir)) {
  fs.mkdirSync(appDir, { recursive: true });
}

for (const [file, routePath] of Object.entries(routes)) {
  const sourcePath = path.join(pagesDir, file);
  if (!fs.existsSync(sourcePath)) {
    console.log('Skipping', file);
    continue;
  }
  
  const destDir = path.join(appDir, routePath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  let content = fs.readFileSync(sourcePath, 'utf8');
  
  // Basic react-router-dom to Next.js conversions
  content = `"use client";\n\n` + content;
  content = content.replace(/import {([^}]*)} from 'react-router-dom';/g, (match, imports) => {
    let nextImports = [];
    if (imports.includes('useNavigate')) nextImports.push('useRouter');
    if (imports.includes('useParams')) nextImports.push('useParams');
    if (imports.includes('useLocation')) nextImports.push('usePathname', 'useSearchParams');
    
    let replacement = `import { ${nextImports.join(', ')} } from 'next/navigation';`;
    if (imports.includes('Link')) {
      replacement += `\nimport Link from 'next/link';`;
    }
    return replacement;
  });
  
  content = content.replace(/useNavigate\(\)/g, 'useRouter()');
  content = content.replace(/useLocation\(\)/g, '{ pathname: usePathname(), search: useSearchParams() ? "?" + useSearchParams().toString() : "" }');
  
  // Also fix internal imports
  content = content.replace(/@\/src\//g, '@/');

  // Some links might be used like <Link to="..."> - convert to <Link href="...">
  content = content.replace(/<Link ([^>]*)to=/g, '<Link $1href=');
  
  fs.writeFileSync(path.join(destDir, 'page.tsx'), content, 'utf8');
  console.log(`Generated app/${routePath}/page.tsx`);
}

console.log('Pages generated successfully.');
