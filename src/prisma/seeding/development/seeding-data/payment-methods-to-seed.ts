export const paymentMethodsToSeed = [
  {
    id: '3a9ea5c3-8967-4e01-9bc1-1d26fde8e3d4',
    name: 'Cash',
    commissionPercentage: 0,
  },
  {
    id: '4de40095-9337-4cd3-8a69-e64ef16edfc2',
    name: 'Debit card',
    commissionPercentage: 3,
  },
  {
    id: 'e49712bb-ab95-4c55-a0d0-e55b26a3e6c5',
    name: 'Credit card',
    commissionPercentage: 9,
  },
  {
    id: 'be179d8b-7295-4ee4-b328-7b2310ef1c06',
    name: 'Virtual wallet',
    commissionPercentage: 0,
  },
  {
    id: '8cfb0776-adc7-467e-92dc-2589f9cd7f5e',
    name: 'Transfer',
    commissionPercentage: 2.45,
  },
] as const;