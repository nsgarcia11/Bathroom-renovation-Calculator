'use client';

import React, { useState } from 'react';
import { TaskOption } from './TaskOption';
import { TabButton } from './TabButton';
import type { TradeChoices, TradeTask } from '@/types/trades';
import { CATEGORY_STYLES } from '@/lib/trades-cost-data';

interface TradesSectionProps {
  choices: TradeChoices;
  onTaskChange: (
    category: string,
    taskId: string,
    hasQuantity?: boolean,
    newQuantity?: string
  ) => void;
}

export function TradesSection({ choices, onTaskChange }: TradesSectionProps) {
  const [openCategories, setOpenCategories] = useState<{
    [key: string]: boolean;
  }>({
    plumbing: true,
    electrical: false,
    hvac: false,
  });
  const [activeTabs, setActiveTabs] = useState<{
    [key: string]: string;
  }>({
    plumbing: 'rough-in',
    electrical: 'rough-in',
    hvac: 'rough-in',
  });

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const handleTabChange = (category: string, tab: string) => {
    setActiveTabs((prev) => ({ ...prev, [category]: tab }));
  };

  const plumbingRoughInOptions: TradeTask[] = [
    { id: 'rough_in_plumbing', label: 'Rough-in new plumbing' },
    { id: 'move_toilet_drain', label: 'Move toilet drain and supply' },
    { id: 'install_new_shower_valve', label: 'Install new shower valve' },
    { id: 'move_drain', label: 'Move drain' },
    {
      id: 'install_standalone_tub_roughin',
      label: 'Rough-in for stand-alone tub',
    },
  ];

  const plumbingFinishingOptions: TradeTask[] = [
    {
      id: 'install_vanity_plumbing',
      label: 'Install vanity sink plumbing',
      hasQuantity: true,
    },
    {
      id: 'install_faucet',
      label: 'Install vanity faucet & supply lines',
      hasQuantity: true,
    },
    { id: 'install_shower_trim', label: 'Install shower & tub trim kit' },
    { id: 'install_toilet', label: 'Install new toilet' },
    {
      id: 'install_standalone_tub_finishing',
      label: 'Install stand-alone tub & faucet',
    },
  ];

  const electricalRoughInOptions: TradeTask[] = [
    {
      id: 'install_new_outlet',
      label: 'Install new outlet',
      hasQuantity: true,
    },
    {
      id: 'install_new_gfci',
      label: 'Install new GFCI outlet',
      hasQuantity: true,
    },
  ];

  const electricalFinishingsOptions: TradeTask[] = [
    {
      id: 'install_light_fixture',
      label: 'Install new light fixture',
      hasQuantity: true,
    },
    { id: 'install_exhaust_fan', label: 'Install new exhaust fan' },
  ];

  const hvacRoughInOptions: TradeTask[] = [
    { id: 'install_hvac_duct_run', label: 'Install new duct run' },
    { id: 'relocate_hvac_vent', label: 'Relocate vent ductwork' },
  ];

  const hvacFinishingsOptions: TradeTask[] = [
    {
      id: 'install_vent_register',
      label: 'Install vent register',
      hasQuantity: true,
    },
    { id: 'install_wall_heater', label: 'Install wall heater' },
  ];

  const renderOptions = (category: string, options: TradeTask[]) => {
    const categoryChoices = choices[category as keyof TradeChoices];
    const choicesArray = Array.isArray(categoryChoices) ? categoryChoices : [];

    return (
      <div className='space-y-2 pt-3'>
        {options.map((opt) => (
          <TaskOption
            key={opt.id}
            option={opt}
            selection={choicesArray.find((c) => c.id === opt.id)}
            onToggle={() => onTaskChange(category, opt.id, opt.hasQuantity)}
            onQuantityChange={(e) =>
              onTaskChange(category, opt.id, opt.hasQuantity, e.target.value)
            }
          />
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-6'>
      <div className='pt-2 pb-6'>
        <h2 className='text-4xl font-bold text-slate-800'>Trades</h2>
        <p className='text-slate-500 mt-1'>Mechanical & Electrical</p>
      </div>

      {/* Card Layout */}
      {Object.keys(openCategories).map((cat) => (
        <div
          key={cat}
          className='bg-white rounded-xl border border-slate-300 shadow-sm overflow-hidden'
        >
          <button
            onClick={() => toggleCategory(cat)}
            className={`w-full flex justify-between items-center p-4 ${
              CATEGORY_STYLES[cat as keyof typeof CATEGORY_STYLES].text
            }`}
          >
            <h3 className='text-lg font-bold'>
              {CATEGORY_STYLES[cat as keyof typeof CATEGORY_STYLES].name}
            </h3>
            <svg
              className={`w-5 h-5 transition-transform text-blue-500 ${
                openCategories[cat] ? 'rotate-180' : ''
              }`}
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M19 9l-7 7-7-7'
              />
            </svg>
          </button>
          {openCategories[cat] && (
            <div className='p-4 pt-0 animate-fade-in'>
              {cat === 'plumbing' ? (
                <>
                  <div className='flex space-x-2 border-b border-slate-200 mb-2 pb-2'>
                    <TabButton
                      label='Rough-in'
                      isActive={activeTabs.plumbing === 'rough-in'}
                      onClick={() => handleTabChange('plumbing', 'rough-in')}
                    />
                    <TabButton
                      label='Finishing'
                      isActive={activeTabs.plumbing === 'finishing'}
                      onClick={() => handleTabChange('plumbing', 'finishing')}
                    />
                  </div>
                  {activeTabs.plumbing === 'rough-in' &&
                    renderOptions('plumbing', plumbingRoughInOptions)}
                  {activeTabs.plumbing === 'finishing' &&
                    renderOptions('plumbing', plumbingFinishingOptions)}
                </>
              ) : cat === 'electrical' ? (
                <>
                  <div className='flex space-x-2 border-b border-slate-200 mb-2 pb-2'>
                    <TabButton
                      label='Rough-in'
                      isActive={activeTabs.electrical === 'rough-in'}
                      onClick={() => handleTabChange('electrical', 'rough-in')}
                    />
                    <TabButton
                      label='Finishings'
                      isActive={activeTabs.electrical === 'finishings'}
                      onClick={() =>
                        handleTabChange('electrical', 'finishings')
                      }
                    />
                  </div>
                  {activeTabs.electrical === 'rough-in' &&
                    renderOptions('electrical', electricalRoughInOptions)}
                  {activeTabs.electrical === 'finishings' &&
                    renderOptions('electrical', electricalFinishingsOptions)}
                </>
              ) : cat === 'hvac' ? (
                <>
                  <div className='flex space-x-2 border-b border-slate-200 mb-2 pb-2'>
                    <TabButton
                      label='Rough-in'
                      isActive={activeTabs.hvac === 'rough-in'}
                      onClick={() => handleTabChange('hvac', 'rough-in')}
                    />
                    <TabButton
                      label='Finishings'
                      isActive={activeTabs.hvac === 'finishings'}
                      onClick={() => handleTabChange('hvac', 'finishings')}
                    />
                  </div>
                  {activeTabs.hvac === 'rough-in' &&
                    renderOptions('hvac', hvacRoughInOptions)}
                  {activeTabs.hvac === 'finishings' &&
                    renderOptions('hvac', hvacFinishingsOptions)}
                </>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
