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

  // React Router to Next.js conversions
  content = content.replace(/import \{ Link, useLocation \} from 'react-router-dom';/g, "import Link from 'next/link';\nimport { usePathname } from 'next/navigation';");
  content = content.replace(/import \{ Link \} from 'react-router-dom';/g, "import Link from 'next/link';");
  content = content.replace(/import \{ useNavigate \} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation';");
  content = content.replace(/const navigate = useNavigate\(\);/g, "const navigate = useRouter();");
  
  content = content.replace(/const location = useLocation\(\);/g, "const pathname = usePathname();");
  content = content.replace(/location\.pathname/g, "pathname");

  // Helmet removals
  content = content.replace(/import \{ Helmet \} from 'react-helmet-async';\n?/g, '');
  content = content.replace(/<Helmet>/g, '<>');
  content = content.replace(/<\/Helmet>/g, '</>');

  // navigate fixes (only safe single quotes / template literals)
  content = content.replace(/navigate\('([^']+)'\)/g, "navigate.push('$1')");
  content = content.replace(/navigate\(`([^`]+)`\)/g, "navigate.push(`$1`)");

  // fix Link to -> href
  content = content.replace(/<Link([^>]*?)to=/g, "<Link$1href=");

  // Check checkout state logic
  if (filePath.includes('checkout/page.tsx')) {
     if (!content.includes('import React, { useState, useEffect }')) {
         content = content.replace(/import React, \{ useState \} from 'react';/, "import React, { useState, useEffect } from 'react';");
     }
     content = content.replace(/const \{ cartItems, summary, address \} = location\.state \|\| \{/g, 
        "const [checkoutState, setCheckoutState] = useState<any>(null);\n  useEffect(() => {\n    const state = localStorage.getItem('checkoutState');\n    if (state) setCheckoutState(JSON.parse(state));\n  }, []);\n  const { cartItems, summary, address } = checkoutState || {");
  }

  // Check cart page state logic
  if (filePath.includes('cart/page.tsx')) {
      content = content.replace(/navigate\('\/checkout',\s*\{\s*state:\s*\{\s*cartItems:\s*cartItems,\s*summary:\s*\{\s*subtotal,\s*shippingCost,\s*total\s*\},\s*address:\s*addr\s*\}\s*\}\);/g, 
        "localStorage.setItem('checkoutState', JSON.stringify({ cartItems, summary: { subtotal, shippingCost, total }, address: addr }));\n    navigate.push('/checkout');");
  }

  // Admin dashboard 'never' types (useState inference fixes)
  if (filePath.includes('admin/dashboard/page.tsx')) {
      content = content.replace(/const \[products, setProducts\] = useState\(\[\]\);/g, "const [products, setProducts] = useState<any[]>([]);");
      content = content.replace(/const \[orders, setOrders\] = useState\(\[\]\);/g, "const [orders, setOrders] = useState<any[]>([]);");
      content = content.replace(/const \[users, setUsers\] = useState\(\[\]\);/g, "const [users, setUsers] = useState<any[]>([]);");
      content = content.replace(/const \[banners, setBanners\] = useState\(\[\]\);/g, "const [banners, setBanners] = useState<any[]>([]);");
      content = content.replace(/const \[categories, setCategories\] = useState\(\[\]\);/g, "const [categories, setCategories] = useState<any[]>([]);");
      content = content.replace(/const \[teams, setTeams\] = useState\(\[\]\);/g, "const [teams, setTeams] = useState<any[]>([]);");
      content = content.replace(/const \[subcategories, setSubcategories\] = useState\(\[\]\);/g, "const [subcategories, setSubcategories] = useState<any[]>([]);");
      content = content.replace(/tempImages: \[\]/g, "tempImages: [] as any[]");
      content = content.replace(/existingImages: \[\]/g, "existingImages: [] as any[]");
      content = content.replace(/useState\(null\)/g, "useState<any>(null)");
      content = content.replace(/setActiveTab\('new'\)/g, "setActiveTab('new' as any)");
  }
  
  // Product details typing
  if (filePath.includes('product/[id]/page.tsx')) {
      content = content.replace(/const \{ id \} = useParams\(\);/g, "const { id } = useParams() as { id: string };");
  }

  // route.ts password typing
  if (filePath.includes('api/auth/[...slug]/route.ts')) {
     content = content.replace(/user\.password\)/g, "(user as any).password)");
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed:', filePath);
  }
});
