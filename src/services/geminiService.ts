import { Transaction, FraudInsight } from "../types";

export async function getFraudExplanation(transaction: Transaction): Promise<FraudInsight> {
  try {
    const response = await fetch("/api/fraud-explanation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transaction }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Backend API Error:", error);
    return {
      reason: "AI analysis unavailable at the moment.",
      riskFactors: ["System Timeout", "API Error"],
      recommendation: "Perform manual review based on transaction history."
    };
  }
}

export async function chatWithAnalyst(query: string, context: any) {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, context }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Backend API Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now.";
  }
}
