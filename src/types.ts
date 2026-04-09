export interface Transaction {
  id: string;
  amount: number;
  riskScore: number;
  status: 'Safe' | 'Suspicious' | 'Blocked';
  timestamp: string;
  user: string;
  location: string;
  device?: DeviceInfo;
  behavior?: BehaviorMetrics;
}

export interface DeviceInfo {
  id: string;
  ip: string;
  browser: string;
  os: string;
  trustScore: number;
}

export interface BehaviorMetrics {
  loginFrequency: number;
  avgTransactionValue: number;
  anomalyScore: number;
}

export interface FraudInsight {
  reason: string;
  recommendation: string;
  riskFactors: string[];
}

export interface Node {
  id: string;
  type: 'user' | 'transaction' | 'device' | 'ip';
  label: string;
}

export interface Link {
  source: string;
  target: string;
  value: number;
}
