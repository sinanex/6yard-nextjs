const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/admin/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add isMobileMenuOpen state
if (!content.includes('isMobileMenuOpen')) {
  content = content.replace(
    /const \[activeTab, setActiveTab\] = useState\('dashboard'\);/,
    `const [activeTab, setActiveTab] = useState('dashboard');\n  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);`
  );
  // Also import Menu icon if not present
  if (!content.includes('Menu,')) {
    content = content.replace(/import \{([\s\S]*?)LayoutDashboard/m, 'import { Menu, \n  LayoutDashboard');
  }
}

// 2. Add Mobile Overlay & Fix Sidebar classes
// Currently: <aside className="w-[240px] bg-white border-r border-brand-surface-normal flex flex-col fixed h-full z-20 shadow-2xl shadow-brand-primary/5">
content = content.replace(
  /<aside className="w-\[240px\] bg-white border-r border-brand-surface-normal flex flex-col fixed h-full z-20 shadow-2xl shadow-brand-primary\/5">/g,
  `{/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
      <aside className={\`w-[240px] bg-white border-r border-brand-surface-normal flex flex-col fixed h-full z-50 shadow-2xl shadow-brand-primary/5 transform transition-transform duration-300 md:translate-x-0 \${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}\`}>`
);

// 3. Fix activeTab setter to also close mobile menu
content = content.replace(
  /setActiveTab\(item\.id\);/g,
  `setActiveTab(item.id); setIsMobileMenuOpen(false);`
);

// 4. Fix main content margin
// Currently: <div className="flex-1 ml-[240px] flex flex-col min-h-screen">
content = content.replace(
  /<div className="flex-1 ml-\[240px\] flex flex-col min-h-screen">/g,
  `<div className="flex-1 md:ml-[240px] w-full max-w-[100vw] flex flex-col min-h-screen overflow-x-hidden">`
);

// 5. Add Hamburger Menu to Header
// Currently: <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-brand-surface-normal flex items-center justify-between px-5 sticky top-0 z-10 shadow-sm">
content = content.replace(
  /<header className="h-16 bg-white\/80 backdrop-blur-xl border-b border-brand-surface-normal flex items-center justify-between px-5 sticky top-0 z-10 shadow-sm">/g,
  `<header className="h-16 bg-white/80 backdrop-blur-xl border-b border-brand-surface-normal flex items-center justify-between px-4 md:px-5 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-2 -ml-2 rounded-lg hover:bg-brand-surface-low text-brand-on-surface"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>`
);

// 6. Fix header padding & close the extra div
content = content.replace(
  /<div>\s*<h2 className="font-h text-lg font-bold uppercase tracking-tight text-brand-on-surface">/,
  `<div>
              <h2 className="font-h text-base md:text-lg font-bold uppercase tracking-tight text-brand-on-surface line-clamp-1">`
);

content = content.replace(
  /new Date\(\)\.toLocaleDateString\('en-US', \{ weekday: 'long', month: 'long', day: 'numeric' \}\)\}\s*<\/p>\s*<\/div>/,
  `new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>` // close the flex items-center gap-3 wrapper
);


// 7. Make the metric cards responsive in the dashboard
// Currently: <div className="grid grid-cols-4 gap-6 mb-6">
content = content.replace(
  /<div className="grid grid-cols-4 gap-6 mb-6">/g,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">`
);

// 8. Make Dashboard charts grid responsive
// Currently: <div className="grid grid-cols-3 gap-6">
content = content.replace(
  /<div className="grid grid-cols-3 gap-6">/g,
  `<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">`
);

// 9. Fix generic paddings inside tabs
content = content.replace(/p-6/g, 'p-4 md:p-6');
content = content.replace(/p-8/g, 'p-4 md:p-5');

// 10. Hide Search in Header on mobile
content = content.replace(
  /<div className="relative">/,
  `<div className="relative hidden sm:block">`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log("Applied responsive patches");
