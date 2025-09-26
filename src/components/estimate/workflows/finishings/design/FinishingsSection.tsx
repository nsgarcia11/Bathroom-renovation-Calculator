'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';
import { FinishingsDesignData } from '@/types/estimate';
import { CollapsibleCard } from '@/components/estimate/shared/CollapsibleCard';
import { OptionToggle } from '@/components/estimate/shared/OptionToggle';
import { PerformedByToggle } from '@/components/estimate/shared/PerformedByToggle';
import { InfoMessage } from '@/components/estimate/shared/InfoMessage';
import { ConfigurableTask } from '@/components/estimate/shared/ConfigurableTask';
import { QuantityInput } from '@/components/estimate/shared/QuantityInput';

interface FinishingsSectionProps {
  designChoices: FinishingsDesignData['designChoices'];
  setDesignChoices: (
    choices:
      | FinishingsDesignData['designChoices']
      | ((
          prev: FinishingsDesignData['designChoices']
        ) => FinishingsDesignData['designChoices'])
  ) => void;
  finishingsScope: FinishingsDesignData['finishingsScope'];
  setFinishingsScope: (
    scope:
      | FinishingsDesignData['finishingsScope']
      | ((
          prev: FinishingsDesignData['finishingsScope']
        ) => FinishingsDesignData['finishingsScope'])
  ) => void;
  accentWalls: FinishingsDesignData['accentWalls'];
  setAccentWalls: (
    walls:
      | FinishingsDesignData['accentWalls']
      | ((
          prev: FinishingsDesignData['accentWalls']
        ) => FinishingsDesignData['accentWalls'])
  ) => void;
}

export function FinishingsSection({
  designChoices,
  setDesignChoices,
  finishingsScope,
  setFinishingsScope,
  accentWalls,
  setAccentWalls,
}: FinishingsSectionProps) {
  const [openSections, setOpenSections] = useState({
    measurements: true,
    painting: false,
    installation: false,
    accentWalls: false,
  });
  const [showPlumbingTradeMessage, setShowPlumbingTradeMessage] =
    useState(false);
  const [showElectricalTradeMessage, setShowElectricalTradeMessage] =
    useState(false);

  // --- HANDLERS ---
  const handleDimensionChange = (
    field: keyof FinishingsDesignData['designChoices'],
    value: string
  ) => {
    setDesignChoices((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleScopeChange = (
    key: keyof FinishingsDesignData['finishingsScope'],
    field: string,
    value: string | boolean | number
  ) => {
    setFinishingsScope((prev) => ({
      ...prev,
      [key]: {
        [field]: value,
      },
    }));
  };

  const handleCategoryPerformedByChange = (
    category: 'plumbingPerformedBy' | 'electricalPerformedBy',
    value: 'me' | 'trade'
  ) => {
    setFinishingsScope((prev) => ({ ...prev, [category]: value }));
    if (value === 'trade') {
      if (category === 'plumbingPerformedBy') setShowPlumbingTradeMessage(true);
      if (category === 'electricalPerformedBy')
        setShowElectricalTradeMessage(true);
    } else {
      if (category === 'plumbingPerformedBy')
        setShowPlumbingTradeMessage(false);
      if (category === 'electricalPerformedBy')
        setShowElectricalTradeMessage(false);
    }
  };

  // --- Accent Wall Handlers ---
  const handleAccentWallChange = (
    field: keyof FinishingsDesignData['accentWalls'],
    value: string | boolean
  ) => {
    setAccentWalls((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='space-y-4'>
      <CollapsibleCard
        title='Measurements'
        isOpen={openSections.measurements}
        onToggle={() =>
          setOpenSections((prev) => ({
            ...prev,
            measurements: !prev.measurements,
          }))
        }
      >
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
              Width (in)
            </label>
            <Input
              type='number'
              value={designChoices.dimensions.width}
              onChange={(e) => handleDimensionChange('width', e.target.value)}
              placeholder='e.g., 60'
              className='w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
              Length (in)
            </label>
            <Input
              type='number'
              value={designChoices.dimensions.length}
              onChange={(e) => handleDimensionChange('length', e.target.value)}
              placeholder='e.g., 96'
              className='w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
          <div>
            <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
              Height (in)
            </label>
            <Input
              type='number'
              value={designChoices.dimensions.height}
              onChange={(e) => handleDimensionChange('height', e.target.value)}
              placeholder='e.g., 96'
              className='w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title='Painting'
        isOpen={openSections.painting}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, painting: !prev.painting }))
        }
      >
        <div className='pl-4 space-y-3'>
          <OptionToggle
            label='Drywall Repairs'
            isEnabled={finishingsScope.fixWalls.selected}
            onToggle={() =>
              handleScopeChange(
                'fixWalls',
                'selected',
                !finishingsScope.fixWalls.selected
              )
            }
          />
          <OptionToggle
            label='Priming'
            isEnabled={finishingsScope.priming.selected}
            onToggle={() =>
              handleScopeChange(
                'priming',
                'selected',
                !finishingsScope.priming.selected
              )
            }
          />
          <OptionToggle
            label='Paint Walls'
            isEnabled={finishingsScope.paintWalls.selected}
            onToggle={() =>
              handleScopeChange(
                'paintWalls',
                'selected',
                !finishingsScope.paintWalls.selected
              )
            }
          />
          <OptionToggle
            label='Paint Ceiling'
            isEnabled={finishingsScope.paintCeiling.selected}
            onToggle={() =>
              handleScopeChange(
                'paintCeiling',
                'selected',
                !finishingsScope.paintCeiling.selected
              )
            }
          />
          <OptionToggle
            label='Paint Trim'
            isEnabled={finishingsScope.paintTrim.selected}
            onToggle={() =>
              handleScopeChange(
                'paintTrim',
                'selected',
                !finishingsScope.paintTrim.selected
              )
            }
          />
          <OptionToggle
            label='Paint Door'
            isEnabled={finishingsScope.paintDoor.selected}
            onToggle={() =>
              handleScopeChange(
                'paintDoor',
                'selected',
                !finishingsScope.paintDoor.selected
              )
            }
          />
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title='Installation'
        isOpen={openSections.installation}
        onToggle={() =>
          setOpenSections((prev) => ({
            ...prev,
            installation: !prev.installation,
          }))
        }
      >
        <div className='pl-4 space-y-4'>
          <div>
            <div className='flex justify-between items-center mb-2'>
              <p className='text-sm font-semibold text-slate-600'>Plumbing</p>
              <PerformedByToggle
                performedBy={finishingsScope.plumbingPerformedBy}
                onToggle={(v) =>
                  handleCategoryPerformedByChange('plumbingPerformedBy', v)
                }
              />
            </div>
            {showPlumbingTradeMessage && (
              <InfoMessage
                message="When 'Trade' is selected, this task's labor isn't included here. Manage it on the 'Trade' screen."
                onClose={() => setShowPlumbingTradeMessage(false)}
              />
            )}
            <div className='pl-4 space-y-3'>
              <ConfigurableTask
                label='Vanity'
                isEnabled={finishingsScope.installVanity.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installVanity',
                    'selected',
                    !finishingsScope.installVanity.selected
                  )
                }
              >
                <QuantityInput
                  label='Number of Sinks'
                  value={finishingsScope.installVanity.sinks}
                  onChange={(v) =>
                    handleScopeChange('installVanity', 'sinks', v.toString())
                  }
                />
              </ConfigurableTask>
              <ConfigurableTask
                label='Sink Faucet(s)'
                isEnabled={finishingsScope.installSinkFaucet.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installSinkFaucet',
                    'selected',
                    !finishingsScope.installSinkFaucet.selected
                  )
                }
              >
                <QuantityInput
                  label='Number of Faucets'
                  value={finishingsScope.installSinkFaucet.quantity}
                  onChange={(v) =>
                    handleScopeChange(
                      'installSinkFaucet',
                      'quantity',
                      v.toString()
                    )
                  }
                />
              </ConfigurableTask>
              <OptionToggle
                label='Shower Drain/Overflow'
                isEnabled={finishingsScope.installShowerDrain.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installShowerDrain',
                    'selected',
                    !finishingsScope.installShowerDrain.selected
                  )
                }
              />
              <OptionToggle
                label='Tub Drain/Overflow'
                isEnabled={finishingsScope.installTubDrain.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installTubDrain',
                    'selected',
                    !finishingsScope.installTubDrain.selected
                  )
                }
              />
              <OptionToggle
                label='Toilet'
                isEnabled={finishingsScope.installToilet.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installToilet',
                    'selected',
                    !finishingsScope.installToilet.selected
                  )
                }
              />
            </div>
          </div>
          <div className='pt-3 border-t border-slate-200'>
            <div className='flex justify-between items-center mb-2'>
              <p className='text-sm font-semibold text-slate-600'>Electrical</p>
              <PerformedByToggle
                performedBy={finishingsScope.electricalPerformedBy}
                onToggle={(v) =>
                  handleCategoryPerformedByChange('electricalPerformedBy', v)
                }
              />
            </div>
            {showElectricalTradeMessage && (
              <InfoMessage
                message="When 'Trade' is selected, this task's labor isn't included here. Manage it on the 'Trade' screen."
                onClose={() => setShowElectricalTradeMessage(false)}
              />
            )}
            <div className='pl-4 space-y-3'>
              <ConfigurableTask
                label='Light Fixtures'
                isEnabled={finishingsScope.installLights.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installLights',
                    'selected',
                    !finishingsScope.installLights.selected
                  )
                }
              >
                <QuantityInput
                  label='Number of Fixtures'
                  value={finishingsScope.installLights.quantity}
                  onChange={(v) =>
                    handleScopeChange('installLights', 'quantity', v.toString())
                  }
                />
              </ConfigurableTask>
              <OptionToggle
                label='Exhaust Fan'
                isEnabled={finishingsScope.installFan.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installFan',
                    'selected',
                    !finishingsScope.installFan.selected
                  )
                }
              />
            </div>
          </div>
          <div className='pt-3 border-t border-slate-200'>
            <p className='text-sm font-semibold text-slate-600 mb-2'>
              Carpentry & Mounting
            </p>
            <div className='pl-4 space-y-3'>
              <OptionToggle
                label='Baseboard'
                isEnabled={finishingsScope.installBaseboard.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installBaseboard',
                    'selected',
                    !finishingsScope.installBaseboard.selected
                  )
                }
              />
              <OptionToggle
                label='Door'
                isEnabled={finishingsScope.installDoor.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installDoor',
                    'selected',
                    !finishingsScope.installDoor.selected
                  )
                }
              />
              <OptionToggle
                label='Shower Door'
                isEnabled={finishingsScope.installShowerDoor.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installShowerDoor',
                    'selected',
                    !finishingsScope.installShowerDoor.selected
                  )
                }
              />
              <OptionToggle
                label='Mirror'
                isEnabled={finishingsScope.installMirror.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installMirror',
                    'selected',
                    !finishingsScope.installMirror.selected
                  )
                }
              />
              <OptionToggle
                label='Bathroom Accessories'
                isEnabled={finishingsScope.installAccessories.selected}
                onToggle={() =>
                  handleScopeChange(
                    'installAccessories',
                    'selected',
                    !finishingsScope.installAccessories.selected
                  )
                }
              />
            </div>
          </div>
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        title='Accent Wall'
        isOpen={openSections.accentWalls}
        onToggle={() =>
          setOpenSections((prev) => ({
            ...prev,
            accentWalls: !prev.accentWalls,
          }))
        }
      >
        <div className='space-y-3'>
          {accentWalls.map((wall, index) => (
            <div
              key={wall.id}
              className='p-4 bg-slate-50 rounded-lg border border-slate-200'
            >
              <div className='flex justify-between items-center mb-3'>
                <p className='font-semibold text-slate-700'>
                  Accent Wall {index + 1}
                </p>
                <Button
                  onClick={() => handleDeleteAccentWall(wall.id)}
                  className='p-1 text-red-500 hover:text-red-700'
                  variant='ghost'
                  size='sm'
                >
                  <Trash2 className='w-5 h-5' />
                </Button>
              </div>
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-xs font-medium text-slate-600 mb-1'>
                      Wall Width (in)
                    </label>
                    <Input
                      type='number'
                      value={wall.dimensions.width}
                      onChange={(e) =>
                        handleAccentWallChange(wall.id, 'width', e.target.value)
                      }
                      placeholder='e.g., 96'
                      className='w-full p-2 border border-slate-300 rounded-lg'
                    />
                  </div>
                  <div>
                    <label className='block text-xs font-medium text-slate-600 mb-1'>
                      Wall Height (in)
                    </label>
                    <Input
                      type='number'
                      value={wall.dimensions.height}
                      onChange={(e) =>
                        handleAccentWallChange(
                          wall.id,
                          'height',
                          e.target.value
                        )
                      }
                      placeholder='e.g., 96'
                      className='w-full p-2 border border-slate-300 rounded-lg'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-xs font-medium text-slate-600'>
                    Finish Type
                  </label>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() =>
                        handleAccentWallChange(wall.id, 'finishType', 'tile')
                      }
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        wall.finishType === 'tile'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Tile
                    </button>
                    <button
                      onClick={() =>
                        handleAccentWallChange(
                          wall.id,
                          'finishType',
                          'wainscot'
                        )
                      }
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        wall.finishType === 'wainscot'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Wainscot
                    </button>
                    <button
                      onClick={() =>
                        handleAccentWallChange(wall.id, 'finishType', 'paint')
                      }
                      className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                        wall.finishType === 'paint'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                    >
                      Paint
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <Button
            onClick={handleAddAccentWall}
            className='w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-100 hover:bg-teal-200 text-teal-800 font-semibold rounded-lg transition-colors border border-teal-200'
          >
            <Plus className='w-5 h-5' />
            Add Accent Wall
          </Button>
        </div>
      </CollapsibleCard>
    </div>
  );
}
