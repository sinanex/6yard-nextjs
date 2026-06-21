const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
};

walk('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove react-helmet-async
    content = content.replace(/import \{ Helmet \} from 'react-helmet-async';\n?/g, '');
    content = content.replace(/<Helmet>/g, '<>');
    content = content.replace(/<\/Helmet>/g, '</>');

    // 2. Fix react-router-dom imports
    content = content.replace(/import \{ Link \} from 'react-router-dom';/g, "import Link from 'next/link';");
    content = content.replace(/import \{ useNavigate \} from 'react-router-dom';/g, "import { useRouter } from 'next/navigation';");
    content = content.replace(/const navigate = useNavigate\(\);/g, "const navigate = useRouter();");

    // 3. Fix navigate calls
    content = content.replace(/navigate\('\/([a-zA-Z0-9_\-/]*)'\)/g, "navigate.push('/$1')");
    content = content.replace(/navigate\('\/'\)/g, "navigate.push('/')");
    // specific checkout state passing workaround
    if (filePath.includes('cart/page.tsx')) {
      content = content.replace(/navigate\('\/checkout',\s*\{\s*state:\s*\{\s*cartItems:\s*cartItems,\s*summary:\s*\{\s*subtotal,\s*shippingCost,\s*total\s*\},\s*address:\s*addr\s*\}\s*\}\);/g, 
        "localStorage.setItem('checkoutState', JSON.stringify({ cartItems, summary: { subtotal, shippingCost, total }, address: addr }));\n    navigate.push('/checkout');");
    }
    if (filePath.includes('checkout/page.tsx')) {
      content = content.replace(/const \{ cartItems, summary, address \} = location\.state \|\| \{/g,
        "const [checkoutState, setCheckoutState] = useState<any>(null);\n  useEffect(() => {\n    const state = localStorage.getItem('checkoutState');\n    if (state) setCheckoutState(JSON.parse(state));\n  }, []);\n  const { cartItems, summary, address } = checkoutState || {");
    }

    // 4. Fix Link to -> Link href
    content = content.replace(/<Link([^>]*?)to=/g, "<Link$1href=");

    // 5. Fix admin/dashboard/page.tsx 'never' types (typing e as any, mapping with any)
    if (filePath.includes('admin/dashboard/page.tsx')) {
      content = content.replace(/const \[products, setProducts\] = useState\(\[\]\);/g, "const [products, setProducts] = useState<any[]>([]);");
      content = content.replace(/const \[orders, setOrders\] = useState\(\[\]\);/g, "const [orders, setOrders] = useState<any[]>([]);");
      content = content.replace(/const \[users, setUsers\] = useState\(\[\]\);/g, "const [users, setUsers] = useState<any[]>([]);");
      content = content.replace(/const \[banners, setBanners\] = useState\(\[\]\);/g, "const [banners, setBanners] = useState<any[]>([]);");
      content = content.replace(/const \[categories, setCategories\] = useState\(\[\]\);/g, "const [categories, setCategories] = useState<any[]>([]);");
      content = content.replace(/const \[teams, setTeams\] = useState\(\[\]\);/g, "const [teams, setTeams] = useState<any[]>([]);");
      content = content.replace(/const \[subcategories, setSubcategories\] = useState\(\[\]\);/g, "const [subcategories, setSubcategories] = useState<any[]>([]);");
      content = content.replace(/setActiveTab\('new'\)/g, "setActiveTab('new' as any)");
      content = content.replace(/setImageFile\(e\.target\.files\[0\]\)/g, "setImageFile(e.target.files?.[0] as any)");
      content = content.replace(/\(item, idx\)/g, "(item: any, idx: number)");
      content = content.replace(/\(item\)/g, "(item: any)");
      content = content.replace(/\(category\)/g, "(category: any)");
      content = content.replace(/\(banner\)/g, "(banner: any)");
      content = content.replace(/\(product\)/g, "(product: any)");
      content = content.replace(/\(user\)/g, "(user: any)");
      content = content.replace(/\(order\)/g, "(order: any)");
    }

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
