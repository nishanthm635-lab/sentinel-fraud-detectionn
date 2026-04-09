import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Transaction, Node, Link } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Share2, Info } from "lucide-react";

interface NetworkGraphProps {
  transactions: Transaction[];
}

export function NetworkGraph({ transactions }: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || transactions.length === 0) return;

    // Prepare data
    const nodes: Node[] = [];
    const links: Link[] = [];
    const nodeSet = new Set<string>();

    // Take recent 15 transactions to keep graph readable
    transactions.slice(0, 15).forEach(tx => {
      const userId = tx.user;
      const txId = tx.id;
      const locId = tx.location;

      if (!nodeSet.has(userId)) {
        nodes.push({ id: userId, type: 'user', label: userId });
        nodeSet.add(userId);
      }
      if (!nodeSet.has(txId)) {
        nodes.push({ id: txId, type: 'transaction', label: `$${tx.amount}` });
        nodeSet.add(txId);
      }
      if (!nodeSet.has(locId)) {
        nodes.push({ id: locId, type: 'ip', label: locId });
        nodeSet.add(locId);
      }

      links.push({ source: userId, target: txId, value: 1 });
      links.push({ source: txId, target: locId, value: 1 });
    });

    const width = 800;
    const height = 500;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
      .attr("stroke", "#ffffff20")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    node.append("circle")
      .attr("r", d => d.type === 'user' ? 12 : d.type === 'transaction' ? 8 : 6)
      .attr("fill", d => d.type === 'user' ? "#3b82f6" : d.type === 'transaction' ? "#ef4444" : "#10b981")
      .attr("stroke", "#000")
      .attr("stroke-width", 1.5);

    node.append("text")
      .attr("dx", 15)
      .attr("dy", 4)
      .text(d => d.label)
      .attr("fill", "#ffffff60")
      .attr("font-size", "10px")
      .attr("font-family", "sans-serif");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [transactions]);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold">Relationship Analysis</h2>
        <p className="text-white/40">Graph-based visualization of linked accounts and entities</p>
      </div>

      <Card className="flex-1 bg-white/5 border-white/10 backdrop-blur-sm relative overflow-hidden">
        <CardHeader className="absolute top-0 left-0 z-10">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Share2 className="w-4 h-4 text-primary" />
            Entity Relationship Map
          </CardTitle>
        </CardHeader>
        
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-md border border-white/10">
            <div className="w-2 h-2 bg-blue-500 rounded-full" /> User Account
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-md border border-white/10">
            <div className="w-2 h-2 bg-red-500 rounded-full" /> Transaction
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/60 bg-black/40 px-2 py-1 rounded-md border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full" /> Location / IP
          </div>
        </div>

        <CardContent className="h-full flex items-center justify-center p-0">
          <svg ref={svgRef} className="w-full h-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet" />
        </CardContent>

        <div className="absolute bottom-4 left-4 right-4 bg-primary/10 border border-primary/20 p-3 rounded-xl flex items-start gap-3">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-primary/80 leading-relaxed">
            This graph visualizes the connections between users, their transactions, and the locations they originate from. 
            Fraud rings often appear as tightly clustered nodes sharing common IPs or device fingerprints across multiple accounts.
          </p>
        </div>
      </Card>
    </div>
  );
}
