import { useState, useRef, useEffect } from "react";
import { Transaction } from "../types";
import { chatWithAnalyst } from "../services/geminiService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { BrainCircuit, Send, User, Bot, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface AIChatProps {
  transactions: Transaction[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AIChat({ transactions }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm Sentinel AI. I can help you analyze recent transaction patterns, explain risk scores, or identify potential fraud rings. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const context = {
      recentTransactions: transactions.slice(0, 10),
      stats: {
        total: transactions.length,
        blocked: transactions.filter(t => t.status === "Blocked").length,
        suspicious: transactions.filter(t => t.status === "Suspicious").length,
      }
    };

    const response = await chatWithAnalyst(userMessage, context);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Sentinel AI Assistant</h2>
        <p className="text-white/40">Intelligent co-pilot for fraud investigation and data analysis</p>
      </div>

      <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-sm flex flex-col overflow-hidden">
        <CardHeader className="border-b border-white/10 bg-white/5">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            AI Analyst Session
          </CardTitle>
        </CardHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4",
                    msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <Avatar className={cn(
                    "w-8 h-8 shrink-0",
                    msg.role === 'assistant' ? "bg-primary text-white" : "bg-white/10 text-white/60"
                  )}>
                    {msg.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </Avatar>
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'assistant' 
                      ? "bg-white/5 border border-white/10 text-white/90" 
                      : "bg-primary text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  )}>
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <div className="flex gap-4">
                <Avatar className="w-8 h-8 bg-primary text-white">
                  <Bot className="w-5 h-5" />
                </Avatar>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-white/40">Sentinel is thinking...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-white/10 bg-black/20">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2"
          >
            <Input 
              placeholder="Ask about fraud patterns, specific users, or risk trends..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="bg-white/5 border-white/10 focus-visible:ring-primary/50"
            />
            <Button type="submit" disabled={loading || !input.trim()} className="bg-primary hover:bg-primary/80">
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-white/20 mt-2 text-center">
            Sentinel AI can make mistakes. Always verify critical findings with manual investigation.
          </p>
        </div>
      </Card>
    </div>
  );
}
