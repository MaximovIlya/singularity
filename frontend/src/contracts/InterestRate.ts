import { ethers, BrowserProvider, Signer } from 'ethers';

// TODO: move ABI to a dedicated file
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

export class InterestRateContract {
  public readonly readOnly: ethers.Contract;
  public readonly writable: ethers.Contract;

  constructor(provider: BrowserProvider, signer: Signer) {
    const contractAddress = import.meta.env
      .VITE_INTEREST_RATE_CONTRACT_ADDRESS as string;
    this.readOnly = new ethers.Contract(
      contractAddress,
      interestRateABI,
      provider
    );
    this.writable = new ethers.Contract(
      contractAddress,
      interestRateABI,
      signer
    );
  }

  // Read methods
  async BASE_RATE(): Promise<bigint> {
    return this.readOnly.BASE_RATE();
  }

  async MULTIPLIER(): Promise<bigint> {
    return this.readOnly.MULTIPLIER();
  }

  async calculateRate(utilization: ethers.BigNumberish): Promise<bigint> {
    return this.readOnly.calculateRate(utilization);
  }
} 