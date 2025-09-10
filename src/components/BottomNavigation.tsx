'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { FileText, Users, Package, Calculator } from 'lucide-react';

const bottomNavItems = [
  { id: 'scope', name: 'Scope', icon: FileText, href: '/scope' },
  { id: 'labor', name: 'Labor', icon: Users, href: '/labor' },
  { id: 'materials', name: 'Materials', icon: Package, href: '/materials' },
  { id: 'estimate', name: 'Estimate', icon: Calculator, href: '/estimate' },
];

export function BottomNavigation() {
  const pathname = usePathname();

  const getCurrentSection = () => {
    if (pathname === '/') return null;
    if (pathname.startsWith('/scope')) return 'scope';
    if (pathname.startsWith('/labor')) return 'labor';
    if (pathname.startsWith('/materials')) return 'materials';
    if (pathname.startsWith('/estimate')) return 'estimate';
    return null;
  };

  const currentSection = getCurrentSection();

  return (
    <div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50'>
      <div className='max-w-4xl mx-auto px-4 py-3'>
        <div className='flex justify-center space-x-8'>
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex flex-col items-center justify-center py-2 px-3 transition-colors rounded-lg ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? 'text-blue-600' : ''}`}
                />
                <span className='text-xs font-medium mt-1'>{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
