import { Transaction } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { ShieldAlert, ShieldX, TrendingUp, AlertCircle, Activity } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface DashboardProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export function Dashboard({ transactions, onSelectTransaction }: DashboardProps) {
  const stats = [
    { label: "Total Transactions", value: transactions.length * 10, icon: Activity, color: "text-blue-400" },
    { label: "Fraud Detected", value: transactions.filter(t => t.status === "Blocked").length, icon: ShieldX, color: "text-red-400" },
    { label: "Suspicious", value: transactions.filter(t => t.status === "Suspicious").length, icon: ShieldAlert, color: "text-yellow-400" },
    { label: "Avg Risk Score", value: Math.round(transactions.reduce((acc, t) => acc + t.riskScore, 0) / (transactions.length || 1)), icon: TrendingUp, color: "text-purple-400" },
  ];

  const chartData = transactions.slice(-20).map(t => ({
    time: new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    score: t.riskScore,
    amount: t.amount / 100
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">System Overview</h2>
          <p className="text-white/40">Real-time monitoring and analytics dashboard</p>
        </div>
        <div className="flex gap-2">
          <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            LIVE SYSTEM ACTIVE
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/40 font-medium">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value.toLocaleString()}</h3>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-white/5", stat.color)}>
                    {(() => {
                      const Icon = stat.icon;
                      return <Icon className="w-6 h-6" />;
                    })()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Risk Score Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} />
                <YAxis stroke="#ffffff40" fontSize={10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-white/10">
              {transactions.filter(t => t.status !== "Safe").slice(0, 5).map((tx) => (
                <div 
                  key={tx.id} 
                  className="p-4 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-4"
                  onClick={() => onSelectTransaction(tx)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                    tx.status === "Blocked" ? "bg-red-500/20 text-red-500" : "bg-yellow-500/20 text-yellow-500"
                  )}>
                    {tx.status === "Blocked" ? <ShieldX className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{tx.user}</p>
                    <p className="text-xs text-white/40 truncate">${tx.amount.toLocaleString()} • {tx.location}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-xs font-bold">{tx.riskScore}%</p>
                    <p className="text-[10px] text-white/20 uppercase">Risk</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
