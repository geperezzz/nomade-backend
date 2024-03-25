export const paymentMethodsToSeed = [
  {
    name: 'Cash',
    commissionPercentage: 0,
  },
  {
    name: 'Debit card',
    commissionPercentage: 3,
  },
  {
    name: 'Credit card',
    commissionPercentage: 9,
  },
  {
    name: 'Virtual wallet',
    commissionPercentage: 0,
  },
  {
    name: 'Transfer',
    commissionPercentage: 2.45,
  },
] as const;
