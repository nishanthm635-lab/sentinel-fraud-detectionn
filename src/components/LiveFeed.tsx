import { Transaction } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck, ShieldAlert, ShieldX, MapPin, Clock, User, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

interface LiveFeedProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export function LiveFeed({ transactions, onSelectTransaction }: LiveFeedProps) {
  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Live Transaction Feed</h2>
          <p className="text-white/40">Real-time stream of global financial activity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-2 h-2 bg-green-500 rounded-full" /> Safe
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" /> Suspicious
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="w-2 h-2 bg-red-500 rounded-full" /> Blocked
          </div>
        </div>
      </div>

      <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="grid grid-cols-6 px-6 py-4 border-b border-white/10 text-xs font-bold text-white/40 uppercase tracking-wider">
          <div className="col-span-2">User / Transaction ID</div>
          <div>Amount</div>
          <div>Location</div>
          <div>Risk Score</div>
          <div className="text-right">Status</div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="divide-y divide-white/5">
            <AnimatePresence initial={false}>
              {transactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-6 px-6 py-4 items-center hover:bg-white/5 cursor-pointer transition-colors group"
                  onClick={() => onSelectTransaction(tx)}
                >
                  <div className="col-span-2 flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-white/10",
                      tx.status === "Safe" ? "bg-green-500/10 text-green-500" : 
                      tx.status === "Suspicious" ? "bg-yellow-500/10 text-yellow-500" : 
                      "bg-red-500/10 text-red-500"
                    )}>
                      {tx.status === "Safe" ? <ShieldCheck className="w-5 h-5" /> : 
                       tx.status === "Suspicious" ? <ShieldAlert className="w-5 h-5" /> : 
                       <ShieldX className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tx.user}</p>
                      <p className="text-[10px] text-white/20 font-mono truncate uppercase">{tx.id}</p>
                    </div>
                  </div>
                  
                  <div className="font-mono text-sm font-bold">
                    ${tx.amount.toLocaleString()}
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-white/60">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{tx.location}</span>
                  </div>
                  
                  <div>
                    <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          tx.riskScore > 80 ? "bg-red-500" : tx.riskScore > 50 ? "bg-yellow-500" : "bg-green-500"
                        )}
                        style={{ width: `${tx.riskScore}%` }}
                      />
                    </div>
                    <p className="text-[10px] mt-1 text-white/40 font-bold">{tx.riskScore}% Risk</p>
                  </div>
                  
                  <div className="text-right flex items-center justify-end gap-3">
                    <Badge className={cn(
                      "px-2 py-0.5 text-[10px] font-bold uppercase",
                      tx.status === "Safe" ? "bg-green-500/20 text-green-500 border-green-500/30" : 
                      tx.status === "Suspicious" ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" : 
                      "bg-red-500/20 text-red-500 border-red-500/30"
                    )}>
                      {tx.status}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-white/0 group-hover:text-white/40 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
