import Decimal from 'decimal.js';

export type ProfitsEntity = {
  profits: Decimal;
  numberOfPaidOrders: number;
  bestSellingServices: {
    serviceId: string;
    numberOfSales: number;
  }[];
}