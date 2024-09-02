import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export const formatDate = (date: number) => {
  return `${new Date(date * 1000).toLocaleDateString()}  ${new Date(
    date * 1000,
  ).toLocaleTimeString()}`;
};

export const formatSolAmount = (amount: number) => {
  return amount / LAMPORTS_PER_SOL;
};

export const formatPythPrice = (rawPrice: string) => {
  const expo = -8;
  const formattedPrice = Number(rawPrice) * Math.pow(10, expo);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
    style: 'currency',
    currency: 'USD',
  }).format(formattedPrice);
};
