import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { LiveFeed } from "./components/LiveFeed";
import { NetworkGraph } from "./components/NetworkGraph";
import { RiskAnalysis } from "./components/RiskAnalysis";
import { AIChat } from "./components/AIChat";
import { Login } from "./components/Login";
import { Transaction } from "./types";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Search, Bell, User, AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getApiUrl, getWebSocketUrl, getApiConfig } from "./config/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  // Authentication functions
  const handleLogin = async (username: string, password: string) => {
    setLoginLoading(true);
    setLoginError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simple demo authentication (in production, this would be an API call)
    if (username === "admin" && password === "sentinel2024") {
      setIsAuthenticated(true);
      setCurrentUser(username);
      setLoginLoading(false);
      toast.success("Welcome back, Admin!", {
        description: "Successfully logged into Sentinel Dashboard"
      });
    } else {
      setLoginError("Invalid username or password");
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser("");
    setActiveTab("dashboard");
    setSelectedTransaction(null);
    toast.info("Logged out successfully");
  };

  useEffect(() => {
    // Only connect to WebSocket and fetch data if authenticated
    if (!isAuthenticated) return;

    const config = getApiConfig();
    console.log('Connecting to backend at:', config.apiBaseUrl);

    // Connect to the REST API for initial data
    fetch(getApiUrl('/api/transactions'))
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setBackendConnected(true);
      })
      .catch(error => {
        console.error('Failed to connect to backend:', error);
        setBackendConnected(false);
      });

    // Connect to WebSocket for real-time updates
    const wsUrl = getWebSocketUrl('/api/ws');
    console.log('Connecting WebSocket to:', wsUrl);
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "INITIAL_DATA") {
        setTransactions(message.data);
      } else if (message.type === "NEW_TRANSACTION") {
        const newTx = message.data;
        setTransactions((prev) => [newTx, ...prev].slice(0, 100));
        
        if (newTx.status === "Blocked") {
          toast.error(`High Risk Transaction Detected!`, {
            description: `User ${newTx.user} attempted a transfer of $${newTx.amount.toLocaleString()}.`,
            action: {
              label: "Investigate",
              onClick: () => {
                setSelectedTransaction(newTx);
                setActiveTab("analysis");
              },
            },
          });
        } else if (newTx.status === "Suspicious") {
          toast.warning(`Suspicious Activity`, {
            description: `Unusual transaction pattern from ${newTx.location}.`,
          });
        }
      }
    };

    socket.onopen = () => {
      setBackendConnected(true);
    };

    socket.onerror = (error) => {
      console.error('WebSocket connection error:', error);
      setBackendConnected(false);
    };

    socket.onclose = () => {
      setBackendConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [isAuthenticated]);

  // Close WebSocket when logging out
  useEffect(() => {
    if (!isAuthenticated && socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, [isAuthenticated]);
  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard transactions={transactions} onSelectTransaction={(tx) => {
          setSelectedTransaction(tx);
          setActiveTab("analysis");
        }} />;
      case "live":
        return <LiveFeed transactions={transactions} onSelectTransaction={(tx) => {
          setSelectedTransaction(tx);
          setActiveTab("analysis");
        }} />;
      case "network":
        return <NetworkGraph transactions={transactions} />;
      case "analysis":
        return <RiskAnalysis transaction={selectedTransaction} />;
      case "ai":
        return <AIChat transactions={transactions} />;
      default:
        return <Dashboard transactions={transactions} onSelectTransaction={() => {}} />;
    }
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-black/40 backdrop-blur-md sticky top-0 z-10">
            <div className="flex items-center gap-4 flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input 
                  placeholder="Search transactions, users, or IPs..." 
                  className="bg-white/5 border-white/10 pl-10 focus-visible:ring-primary/50"
                />
              </div>
              
              {/* Backend Connection Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${
                  backendConnected === true ? 'bg-green-500' : 
                  backendConnected === false ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <span className="text-white/60">
                  {backendConnected === true ? 'Connected' : 
                   backendConnected === false ? 'Backend Offline' : 'Connecting...'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/10">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
              </Button>
              <div className="h-8 w-[1px] bg-white/10 mx-2" />
              <div className="flex items-center gap-3 pl-2">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{currentUser || "Admin User"}</p>
                  <p className="text-xs text-white/40">Fraud Analyst</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/60 hover:text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center border border-white/20">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {backendConnected === false ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-8 h-8 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Backend Server Not Available</h2>
                    <p className="text-white/60 mb-4">
                      The fraud detection system requires a backend server to function properly.
                    </p>
                    <div className="bg-black/40 border border-white/10 rounded-lg p-4 text-left max-w-md mx-auto">
                      <p className="text-sm text-white/80 mb-2">To start the full application:</p>
                      <code className="text-xs bg-black/60 px-2 py-1 rounded block">
                        npm run dev
                      </code>
                      <p className="text-xs text-white/60 mt-2">
                        This will start both the frontend and backend servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              renderContent()
            )}
          </main>
        </div>
        
        <Toaster theme="dark" position="top-right" closeButton richColors />
      </div>
    </TooltipProvider>
  );
}
