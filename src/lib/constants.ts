// Canadian Provinces with Tax Rates
export const PROVINCES = {
  AB: { name: 'Alberta', taxRate: 5 },
  BC: { name: 'British Columbia', taxRate: 12 },
  MB: { name: 'Manitoba', taxRate: 12 },
  NB: { name: 'New Brunswick', taxRate: 15 },
  NL: { name: 'Newfoundland and Labrador', taxRate: 15 },
  NS: { name: 'Nova Scotia', taxRate: 15 },
  NT: { name: 'Northwest Territories', taxRate: 5 },
  NU: { name: 'Nunavut', taxRate: 5 },
  ON: { name: 'Ontario', taxRate: 13 },
  PE: { name: 'Prince Edward Island', taxRate: 15 },
  QC: { name: 'Quebec', taxRate: 14.975 },
  SK: { name: 'Saskatchewan', taxRate: 11 },
  YT: { name: 'Yukon', taxRate: 5 },
} as const;

// Currency options
export const CURRENCIES = {
  CAD: 'Canadian Dollar',
  USD: 'US Dollar',
} as const;

// Default settings
export const DEFAULT_SETTINGS = {
  companyName: '',
  companyEmail: '',
  companyPhone: '',
  address: '',
  postalCode: '',
  province: 'ON',
  hourlyRate: '75',
  taxRate: '13',
  currency: 'CAD',
};
