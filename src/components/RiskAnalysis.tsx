import { useState, useEffect } from "react";
import { Transaction, FraudInsight } from "../types";
import { getFraudExplanation } from "../services/geminiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldAlert, ShieldX, BrainCircuit, MapPin, Smartphone, Fingerprint, Globe, Info, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface RiskAnalysisProps {
  transaction: Transaction | null;
}

export function RiskAnalysis({ transaction }: RiskAnalysisProps) {
  const [insight, setInsight] = useState<FraudInsight | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setLoading(true);
      setInsight(null);
      getFraudExplanation(transaction).then(res => {
        setInsight(res);
        setLoading(false);
      });
    }
  }, [transaction]);

  if (!transaction) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
          <ShieldAlert className="w-10 h-10 text-white/20" />
        </div>
        <div>
          <h3 className="text-xl font-bold">No Transaction Selected</h3>
          <p className="text-white/40 max-w-xs">Select a transaction from the Dashboard or Live Feed to perform a deep risk analysis.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Deep Risk Analysis</h2>
          <p className="text-white/40">AI-powered investigation for transaction {transaction.id}</p>
        </div>
        <Badge className={cn(
          "px-4 py-1 text-sm uppercase font-bold",
          transaction.status === "Safe" ? "bg-green-500/20 text-green-500" : 
          transaction.status === "Suspicious" ? "bg-yellow-500/20 text-yellow-500" : 
          "bg-red-500/20 text-red-500"
        )}>
          {transaction.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Transaction Details */}
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Transaction Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Amount</span>
                <span className="text-xl font-bold font-mono">${transaction.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">User</span>
                <span className="text-sm font-medium">{transaction.user}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Timestamp</span>
                <span className="text-sm font-medium">{new Date(transaction.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/40 text-sm">Location</span>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <MapPin className="w-3 h-3 text-primary" />
                  {transaction.location}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Device Fingerprint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Smartphone className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">Device Type</p>
                  <p className="text-sm font-medium">iPhone 15 Pro (iOS 17.4)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Globe className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">IP Address</p>
                  <p className="text-sm font-medium">192.168.1.104 (VPN Detected)</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                <Fingerprint className="w-5 h-5 text-white/40" />
                <div>
                  <p className="text-xs text-white/40">Trust Score</p>
                  <p className="text-sm font-medium text-red-400">Low (34/100)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle & Right Column: AI Insights */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <BrainCircuit className="w-32 h-32 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-primary" />
                Sentinel AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-4 w-3/4 bg-white/5" />
                  <Skeleton className="h-20 w-full bg-white/5" />
                </div>
              ) : insight ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-2">Analysis Reason</h4>
                    <p className="text-lg leading-relaxed">{insight.reason}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3">Risk Factors</h4>
                    <div className="flex flex-wrap gap-2">
                      {insight.riskFactors.map((factor, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
                          <ShieldAlert className="w-3 h-3" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      Analyst Recommendation
                    </h4>
                    <p className="text-sm text-white/80 italic">"{insight.recommendation}"</p>
                  </div>
                </motion.div>
              ) : null}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase text-white/40">Behavioral Score</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                    <circle 
                      cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={364.4}
                      strokeDashoffset={364.4 - (364.4 * (transaction.riskScore / 100))}
                      className={cn(
                        "transition-all duration-1000",
                        transaction.riskScore > 80 ? "text-red-500" : transaction.riskScore > 50 ? "text-yellow-500" : "text-green-500"
                      )}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">{transaction.riskScore}</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase">Anomaly</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-sm font-medium uppercase text-white/40">Decision Engine</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-xs">Approve</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] opacity-40">Auto</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs">Flag for Review</span>
                  </div>
                  <Badge className="text-[10px] bg-yellow-500/20 text-yellow-500 border-none">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <span className="text-xs">Block</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] opacity-40">Manual</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
