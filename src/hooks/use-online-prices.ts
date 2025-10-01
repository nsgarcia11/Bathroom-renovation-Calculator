'use client';

import { useState, useCallback } from 'react';

interface OnlinePrice {
  source: string;
  price: number;
  url: string;
  availability: string;
  lastUpdated: string;
}

interface MaterialPriceSearch {
  material: string;
  category: string;
  specifications?: string;
}

export function useOnlinePrices() {
  const [prices, setPrices] = useState<Record<string, OnlinePrice[]>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPrices = useCallback(
    async (searchParams: MaterialPriceSearch) => {
      const { material, category, specifications } = searchParams;
      const searchKey = `${material}-${category}-${specifications || ''}`;

      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call - in real implementation, this would call actual price APIs
        // For now, we'll return mock data
        const mockPrices: OnlinePrice[] = [
          {
            source: 'Home Depot',
            price: Math.random() * 100 + 10,
            url: `https://homedepot.ca/search?q=${encodeURIComponent(
              material
            )}`,
            availability: 'In Stock',
            lastUpdated: new Date().toISOString(),
          },
          {
            source: 'Lowes',
            price: Math.random() * 100 + 15,
            url: `https://lowes.ca/search?q=${encodeURIComponent(material)}`,
            availability: 'In Stock',
            lastUpdated: new Date().toISOString(),
          },
          {
            source: 'Rona',
            price: Math.random() * 100 + 12,
            url: `https://rona.ca/search?q=${encodeURIComponent(material)}`,
            availability: 'Limited Stock',
            lastUpdated: new Date().toISOString(),
          },
        ];

        // Sort by price (lowest first)
        mockPrices.sort((a, b) => a.price - b.price);

        setPrices((prev) => ({
          ...prev,
          [searchKey]: mockPrices,
        }));

        return mockPrices;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch prices';
        setError(errorMessage);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getPrices = useCallback(
    (searchKey: string) => {
      return prices[searchKey] || [];
    },
    [prices]
  );

  const clearPrices = useCallback(() => {
    setPrices({});
    setError(null);
  }, []);

  return {
    searchPrices,
    getPrices,
    clearPrices,
    isLoading,
    error,
  };
}
