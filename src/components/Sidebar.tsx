import { LayoutDashboard, Activity, Share2, ShieldAlert, BrainCircuit, Settings, LogOut, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "live", label: "Live Feed", icon: Activity },
    { id: "network", label: "Network Graph", icon: Share2 },
    { id: "analysis", label: "Risk Analysis", icon: ShieldAlert },
    { id: "ai", label: "Sentinel AI", icon: BrainCircuit },
  ];

  return (
    <aside className="w-64 border-r border-white/10 flex flex-col bg-black/60 backdrop-blur-xl">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          <ShieldAlert className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-xl tracking-tight">SENTINEL</h1>
          <p className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase opacity-80">Fraud Detection</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
              activeTab === item.id 
                ? "bg-primary/10 text-primary" 
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            {activeTab === item.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute left-0 w-1 h-6 bg-primary rounded-r-full"
              />
            )}
            <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-primary" : "group-hover:scale-110 transition-transform")} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
