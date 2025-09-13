'use client';

import React, { useState, useEffect } from 'react';
import { Wrench, Building, Percent, Award, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PROVINCES, DEFAULT_SETTINGS } from '@/lib/constants';

interface SetupWizardProps {
  onFinish: (settings: {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    address: string;
    postalCode: string;
    province: string;
    hourlyRate: string;
    taxRate: string;
    currency: string;
  }) => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    // Set initial tax rate based on default province
    setSettings((prev) => ({
      ...prev,
      taxRate:
        PROVINCES[prev.province as keyof typeof PROVINCES].taxRate.toString(),
    }));
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceCode = e.target.value;
    const taxRate =
      PROVINCES[provinceCode as keyof typeof PROVINCES]?.taxRate || 0;
    setSettings((prev) => ({
      ...prev,
      province: provinceCode,
      taxRate: taxRate.toString(),
    }));
  };

  const handleCurrencyChange = (currency: 'CAD' | 'USD') => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  const isStep1Valid =
    settings.companyName.trim() !== '' &&
    settings.companyEmail.trim() !== '' &&
    settings.companyPhone.trim() !== '' &&
    settings.address.trim() !== '' &&
    settings.postalCode.trim() !== '';

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='text-center max-w-2xl mx-auto'>
            <Wrench className='w-16 h-16 mx-auto text-blue-500 mb-4' />
            <h1 className='text-2xl sm:text-3xl font-bold text-slate-800'>
              Welcome to the Calculator
            </h1>

            <div className='relative bg-white border-l-4 border-blue-500 shadow-md rounded-lg p-5 my-6 text-left'>
              <div className='absolute -top-4 -right-4 bg-blue-600 p-2 rounded-full shadow-lg'>
                <Award className='w-6 h-6 text-white' />
              </div>
              <p className='text-slate-700 text-base sm:text-sm leading-relaxed'>
                Built from nearly{' '}
                <span className='font-bold text-slate-800'>15 years</span> of{' '}
                <span className='font-bold text-slate-800'>award-winning</span>{' '}
                custom renovation experience, this calculator is designed to be
                intuitive and powerful. While the default prices are based on
                industry research, every labor and material field is{' '}
                <span className='font-bold text-blue-600'>fully editable</span>{' '}
                to match your business needs.
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200 text-left'>
              <div className='flex items-center space-x-3 border-b pb-2 mb-4'>
                <Info className='w-5 h-5 text-blue-500' />
                <h3 className='font-semibold text-lg sm:text-md text-slate-800'>
                  Quick Guide
                </h3>
              </div>
              <ul className='space-y-2 text-base sm:text-sm text-slate-600'>
                <li className='flex items-start'>
                  <span className='font-bold text-slate-700 mr-2 mt-1'>
                    &#8226;
                  </span>
                  <span>
                    Fields for{' '}
                    <span className='font-semibold'>labor and materials</span>{' '}
                    are editable. You can name items and change hours or prices
                    easily and quickly.
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='w-3 h-3 bg-blue-500 rounded-full mr-2 inline-block flex-shrink-0'></span>
                  <span>
                    <span className='font-semibold'>Blue items</span> are
                    interactive. Tap them to take an action or edit details.
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='w-3 h-3 bg-orange-400 rounded-full mr-2 inline-block flex-shrink-0'></span>
                  <span>
                    <span className='font-semibold'>Orange indicators</span> are
                    warnings or require your attention.
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='w-3 h-3 bg-slate-400 rounded-full mr-2 inline-block flex-shrink-0'></span>
                  <span>
                    <span className='font-semibold'>Grey indicators</span> are
                    for your information.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div className='max-w-md mx-auto'>
            <div className='text-center mb-8'>
              <Building className='w-12 h-12 mx-auto text-blue-500 mb-4' />
              <h2 className='text-xl sm:text-2xl font-bold text-slate-800'>
                Tell us about your business
              </h2>
            </div>
            <div className='space-y-4'>
              <Input
                id='companyName'
                name='companyName'
                label='Company Name'
                value={settings.companyName}
                onChange={handleChange}
                placeholder='e.g., Acme Renovations'
              />
              <Input
                id='companyEmail'
                name='companyEmail'
                label='Company Email'
                value={settings.companyEmail}
                onChange={handleChange}
                placeholder='contact@company.com'
                type='email'
              />
              <Input
                id='companyPhone'
                name='companyPhone'
                label='Company Phone #'
                value={settings.companyPhone}
                onChange={handleChange}
                placeholder='(555) 123-4567'
                type='tel'
              />
              <Input
                id='address'
                name='address'
                label='Company Address'
                value={settings.address}
                onChange={handleChange}
                placeholder='123 Your Street, Your City'
              />
              <Input
                id='postalCode'
                name='postalCode'
                label='Postal Code'
                value={settings.postalCode}
                onChange={handleChange}
                placeholder='A1B 2C3'
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className='max-w-md mx-auto'>
            <div className='text-center mb-8'>
              <Percent className='w-12 h-12 mx-auto text-blue-500 mb-4' />
              <h2 className='text-xl sm:text-2xl font-bold text-slate-800'>
                Set your financials & taxes
              </h2>
            </div>
            <div className='space-y-6'>
              <Input
                id='hourlyRate'
                name='hourlyRate'
                label='Default Hourly Rate'
                value={settings.hourlyRate}
                onChange={handleChange}
                placeholder='e.g., 75'
                type='number'
              />
              <div className='grid grid-cols-2 gap-4'>
                <Select
                  id='province'
                  name='province'
                  label='Province'
                  value={settings.province}
                  onChange={handleProvinceChange}
                >
                  {Object.entries(PROVINCES).map(([code, { name }]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </Select>
                <Input
                  id='taxRate'
                  name='taxRate'
                  label='Tax Rate (%)'
                  value={settings.taxRate}
                  onChange={handleChange}
                  type='number'
                />
              </div>
              <div>
                <label className='block text-base sm:text-sm font-medium text-slate-600 mb-2'>
                  Currency
                </label>
                <div className='flex rounded-md'>
                  {/* <button
                    onClick={() => handleCurrencyChange('CAD')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                      settings.currency === 'CAD'
                        ? 'bg-blue-600 text-white z-10 border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    CAD
                  </button> */}
                  <Button
                    onClick={() => handleCurrencyChange('CAD')}
                    className='px-6 py-2.5'
                  >
                    CAD
                  </Button>
                  {/* <button
                    onClick={() => handleCurrencyChange('USD')}
                    className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-md w-full border ${
                      settings.currency === 'USD'
                        ? 'bg-blue-600 text-white z-10 border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    USD
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='h-full bg-slate-50 flex flex-col p-4 sm:p-8'>
      <div className='flex-1 overflow-y-auto py-4 sm:py-8'>{renderStep()}</div>
      <div className='flex-shrink-0 pb-4 sm:pb-6 pt-4 border-t border-slate-200 bg-white -mx-4 sm:-mx-8 px-4 sm:px-8'>
        {step > 1 && (
          <div className='flex items-center justify-between'>
            <Button
              onClick={prevStep}
              variant='outline'
              className='px-6 py-2.5'
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                onClick={nextStep}
                disabled={step === 2 && !isStep1Valid}
                className='px-6 py-2.5'
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={() => onFinish(settings)}
                className='px-6 py-2.5'
              >
                Finish Setup
              </Button>
            )}
          </div>
        )}
        {step === 1 && (
          <Button onClick={nextStep} className='w-full px-6 py-3'>
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
};
