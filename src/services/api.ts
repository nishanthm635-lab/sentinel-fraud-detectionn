/**
 * API Service Functions
 * Handles all backend API communication
 */

import { getApiUrl } from '../config/api';

export interface FraudAnalysisRequest {
  transaction: any;
}

export interface FraudAnalysisResponse {
  reason: string;
  riskFactors: string[];
  recommendation: string;
}

export interface ChatRequest {
  query: string;
  context?: any;
}

export interface ChatResponse {
  text: string;
}

/**
 * Fetch recent transactions
 */
export async function fetchTransactions() {
  const response = await fetch(getApiUrl('/api/transactions'));
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
}

/**
 * Get fraud analysis for a transaction
 */
export async function analyzeFraud(transaction: any): Promise<FraudAnalysisResponse> {
  const response = await fetch(getApiUrl('/api/fraud-explanation'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ transaction }),
  });
  if (!response.ok) throw new Error('Failed to analyze fraud');
  return response.json();
}

/**
 * Send message to AI chat
 */
export async function chatWithAI(query: string, context?: any): Promise<ChatResponse> {
  const response = await fetch(getApiUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, context }),
  });
  if (!response.ok) throw new Error('Failed to get AI response');
  return response.json();
}

/**
 * Check server health
 */
export async function checkServerHealth() {
  try {
    const response = await fetch(getApiUrl('/api/health'));
    if (!response.ok) throw new Error('Server health check failed');
    return response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}
