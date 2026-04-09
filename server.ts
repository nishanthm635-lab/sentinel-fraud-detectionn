import express from "express";
import { createServer as createViteServer } from "vite";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS for all routes
  app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true
  }));

  // Mock data generation for real-time feed
  const transactions: any[] = [];
  
  const generateTransaction = () => {
    const id = Math.random().toString(36).substring(7);
    const amount = Math.floor(Math.random() * 10000) + 10;
    const riskScore = Math.floor(Math.random() * 100);
    const status = riskScore > 80 ? "Blocked" : riskScore > 50 ? "Suspicious" : "Safe";
    const timestamp = new Date().toISOString();
    const user = `User_${Math.floor(Math.random() * 1000)}`;
    const location = ["New York, USA", "London, UK", "Tokyo, Japan", "Berlin, Germany", "Sydney, Australia", "Lagos, Nigeria"][Math.floor(Math.random() * 6)];
    
    return { id, amount, riskScore, status, timestamp, user, location };
  };

  // Generate some initial transactions
  for (let i = 0; i < 20; i++) {
    transactions.push(generateTransaction());
  }

  app.use(express.json());

  // API routes
  app.post("/api/fraud-explanation", async (req, res) => {
    try {
      const { transaction } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          reason: "AI analysis is not configured. Please set GEMINI_API_KEY environment variable.",
          riskFactors: ["AI Service Unavailable"],
          recommendation: "Configure Gemini API key to enable AI-powered fraud analysis."
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Analyze this financial transaction for potential fraud and provide an explanation in JSON format.
        Transaction: ${JSON.stringify(transaction)}
        
        Return a JSON object with:
        - reason: A concise explanation of why this transaction was flagged (or why it's safe).
        - riskFactors: A list of specific risk factors identified.
        - recommendation: Actionable advice for the fraud analyst.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const result = JSON.parse(response.text);
      res.json(result);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        reason: "AI analysis unavailable at the moment.",
        riskFactors: ["System Timeout", "API Error"],
        recommendation: "Perform manual review based on transaction history."
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { query, context } = req.body;
      
      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({ 
          text: "I'm sorry, my AI brain isn't configured yet. Please set the GEMINI_API_KEY environment variable." 
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `You are Sentinel AI, an expert financial fraud analyst assistant. 
        Help the user with their query about fraud detection and financial security.
        Context: ${JSON.stringify(context)}
        Query: ${query}
        
        Provide helpful, concise, and professional responses focused on fraud detection and prevention.`,
      });
      res.json({ text: response.text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ text: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." });
    }
  });

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/transactions", (req, res) => {
    res.json(transactions.slice(-50).reverse());
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Sentinel Fraud Detection Server running on http://localhost:${PORT} (0.0.0.0)`);
    console.log(`📊 WebSocket endpoint: ws://localhost:${PORT}/api/ws`);
    console.log(`🤖 AI Analysis: ${process.env.GEMINI_API_KEY ? 'Enabled' : 'Disabled (no API key)'}`);
  }).on('error', (error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  });

  // WebSocket setup
  const wss = new WebSocketServer({ server, path: '/api/ws' });

  wss.on("connection", (ws) => {
    console.log("Client connected to WebSocket");
    
    // Send initial data to new connections
    if (transactions.length > 0) {
      ws.send(JSON.stringify({ 
        type: "INITIAL_DATA", 
        data: transactions.slice(-50).reverse() 
      }));
    }

    const interval = setInterval(() => {
      const tx = generateTransaction();
      transactions.push(tx);
      if (transactions.length > 1000) transactions.shift();
      
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "NEW_TRANSACTION", data: tx }));
      }
    }, 3000);

    ws.on("close", () => {
      clearInterval(interval);
      console.log("Client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clearInterval(interval);
    });
  });
}

startServer();
