import { ethers, BrowserProvider, Signer } from 'ethers';

// TODO: move ABI to a dedicated file
export const interestRateABI = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'base_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'slopeLow_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'slopeHigh_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'kink_',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'ParamsUpdated',
    type: 'event',
  },
  {
    inputs: [],
    name: 'SECONDS_PER_YEAR',
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
    name: 'baseRatePerYear',
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
        name: 'cash',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'borrows',
        type: 'uint256',
      },
    ],
    name: 'getBorrowRate',
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
    name: 'kink',
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
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'base_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'slopeLow_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'slopeHigh_',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'kink_',
        type: 'uint256',
      },
    ],
    name: 'setParams',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'slopeHighPerYear',
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
    name: 'slopeLowPerYear',
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
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
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
