export interface Currency {
  id: string;
  name: string;
  symbol: string;
  description?: string;
  icon: string;
}

export type CurrencyId = 'ETH';

import EthIcon from '../../assets/crypto/ethereum-eth-logo.svg';

export const CURRENCIES: Currency[] = [
  {
    id: 'ETH',
    name: 'ETH',
    symbol: 'ETH',
    description: 'Ethereum',
    icon: EthIcon
  }
];

export const getCurrencyById = (id: CurrencyId): Currency | undefined => {
  return CURRENCIES.find(currency => currency.id === id);
}; 