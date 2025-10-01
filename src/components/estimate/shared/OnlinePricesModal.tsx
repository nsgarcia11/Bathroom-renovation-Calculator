'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnlinePrices } from '@/hooks/use-online-prices';

interface OnlinePrice {
  source: string;
  price: number;
  url: string;
  availability: string;
  lastUpdated: string;
}

interface OnlinePricesModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialName: string;
  category: string;
  specifications?: string;
  onPriceSelect: (price: number, source: string) => void;
}

export function OnlinePricesModal({
  isOpen,
  onClose,
  materialName,
  category,
  specifications,
  onPriceSelect,
}: OnlinePricesModalProps) {
  const { searchPrices, isLoading, error } = useOnlinePrices();
  const [prices, setPrices] = useState<OnlinePrice[]>([]);

  /* const searchKey = `${materialName}-${category}-${specifications || ''}`; */

  useEffect(() => {
    if (isOpen && materialName) {
      searchPrices({
        material: materialName,
        category,
        specifications,
      }).then(setPrices);
    }
  }, [isOpen, materialName, category, specifications, searchPrices]);

  const handleRefresh = () => {
    searchPrices({
      material: materialName,
      category,
      specifications,
    }).then(setPrices);
  };

  const handlePriceSelect = (price: number, source: string) => {
    onPriceSelect(parseFloat(price.toFixed(2)), source);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='backdrop-overlay' />
      <div className='bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto relative z-10'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Online Prices for {materialName}
          </h3>
          <Button variant='ghost' size='sm' onClick={onClose} className='p-1'>
            <X size={20} />
          </Button>
        </div>

        <div className='mb-4'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-sm text-gray-600'>Category:</span>
            <span className='text-sm font-medium'>{category}</span>
          </div>
          {specifications && (
            <div className='flex items-center gap-2'>
              <span className='text-sm text-gray-600'>Specifications:</span>
              <span className='text-sm font-medium'>{specifications}</span>
            </div>
          )}
        </div>

        <div className='flex justify-between items-center mb-4'>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant='outline'
            size='sm'
            className='flex items-center gap-2'
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            Refresh Prices
          </Button>
        </div>

        {error && (
          <div className='flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4'>
            <AlertCircle size={16} className='text-red-600' />
            <span className='text-sm text-red-600'>{error}</span>
          </div>
        )}

        {isLoading && prices.length === 0 ? (
          <div className='flex items-center justify-center py-8'>
            <RefreshCw size={24} className='animate-spin text-blue-600' />
            <span className='ml-2 text-gray-600'>Searching for prices...</span>
          </div>
        ) : (
          <div className='space-y-3'>
            {prices.map((price, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors'
              >
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-2'>
                      <h4 className='font-medium text-gray-900'>
                        {price.source}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          price.availability === 'In Stock'
                            ? 'bg-green-100 text-green-800'
                            : price.availability === 'Limited Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {price.availability}
                      </span>
                    </div>
                    <div className='text-2xl font-bold text-blue-600 mb-2'>
                      ${price.price.toFixed(2)}
                    </div>
                    <div className='text-xs text-gray-500'>
                      Last updated:{' '}
                      {new Date(price.lastUpdated).toLocaleString()}
                    </div>
                  </div>
                  <div className='flex flex-col gap-2 ml-4'>
                    <Button
                      onClick={() =>
                        handlePriceSelect(price.price, price.source)
                      }
                      size='sm'
                      className='bg-blue-600 hover:bg-blue-700 text-white'
                    >
                      Use This Price
                    </Button>
                    <Button
                      onClick={() => window.open(price.url, '_blank')}
                      variant='outline'
                      size='sm'
                      className='flex items-center gap-1'
                    >
                      <ExternalLink size={14} />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && prices.length === 0 && !error && (
          <div className='text-center py-8 text-gray-500'>
            No prices found for this material.
          </div>
        )}
      </div>
    </div>
  );
}
