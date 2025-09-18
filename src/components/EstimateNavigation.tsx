'use client';

import { useEstimate } from '@/contexts/EstimateContext';
import { FileText, Users, Package, Calculator, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function EstimateNavigation() {
  const { activeSection, setActiveSection } = useEstimate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className='flex justify-around py-2'>
      <button
        onClick={() => setActiveSection('scope')}
        className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
          activeSection === 'scope'
            ? 'text-blue-600'
            : 'text-gray-400 hover:text-blue-600'
        }`}
      >
        <FileText size={20} />
        <span className='text-sm sm:text-xs font-medium'>Scope</span>
      </button>
      <button
        onClick={() => setActiveSection('labor')}
        className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
          activeSection === 'labor'
            ? 'text-blue-600'
            : 'text-gray-400 hover:text-blue-600'
        }`}
      >
        <Users size={20} />
        <span className='text-sm sm:text-xs font-medium'>Labor</span>
      </button>
      <button
        onClick={() => setActiveSection('materials')}
        className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
          activeSection === 'materials'
            ? 'text-blue-600'
            : 'text-gray-400 hover:text-blue-600'
        }`}
      >
        <Package size={20} />
        <span className='text-sm sm:text-xs font-medium'>Materials</span>
      </button>
      <button
        onClick={() => setActiveSection('estimate')}
        className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
          activeSection === 'estimate'
            ? 'text-blue-600'
            : 'text-gray-400 hover:text-blue-600'
        }`}
      >
        <Calculator size={20} />
        <span className='text-sm sm:text-xs font-medium'>Estimate</span>
      </button>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className='flex flex-col items-center space-y-1 p-2 text-gray-400 hover:text-blue-600 transition-colors'
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        <span className='text-xs font-medium'>Menu</span>
      </button>
    </div>
  );
}
