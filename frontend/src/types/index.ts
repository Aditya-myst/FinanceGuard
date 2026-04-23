export interface Mortgage {
  propertyHash: string;
  financier: string;
  timestamp: bigint;
  isActive: boolean;
  amount: bigint;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
}

export interface PropertyDetails {
  address: string;
  id: number;
  hash?: string;
}