import { AContract } from '../AContract';

export const interestRateABI = [
  {
    inputs: [],
    name: 'BASE_RATE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MULTIPLIER',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'utilization',
        type: 'uint256',
      },
    ],
    name: 'calculateRate',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
];

class InterestRateContract extends AContract {
  constructor() {
    super(
      import.meta.env.VITE_INTEREST_RATE_CONTRACT_ADDRESS as string,
      interestRateABI
    );
  }
}

export const interestRateContract = new InterestRateContract();
