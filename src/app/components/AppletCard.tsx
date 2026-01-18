import { useState } from "react";
import { motion } from "motion/react";
import {
  Brain,
  Radio,
  Shield,
  Database,
  Sparkles,
  Code,
  Fuel,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import InvokeModal from "./InvokeModal";

interface Applet {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  gasCost: number;
  icon: string;
  contractHash?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface AppletCardProps {
  applet: Applet;
  isWalletConnected: boolean;
}

const iconMap: Record<string, any> = {
  brain: Brain,
  radio: Radio,
  shield: Shield,
  database: Database,
  sparkles: Sparkles,
  code: Code,
  file: File,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  AI: { bg: "bg-primary/10", text: "text-primary", border: "border-primary/20" },
  Oracle: { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
  Audit: { bg: "bg-success/10", text: "text-success", border: "border-success/20" },
  Storage: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/20" },
  DeFi: { bg: "bg-chart-3/10", text: "text-chart-3", border: "border-chart-3/20" },
  Compute: { bg: "bg-chart-5/10", text: "text-chart-5", border: "border-chart-5/20" },
};

export default function AppletCard({ applet, isWalletConnected }: AppletCardProps) {
  const [isInvokeModalOpen, setIsInvokeModalOpen] = useState(false);
  const Icon = iconMap[applet.icon] || Code;
  const colors = categoryColors[applet.category] || categoryColors.AI;

  return (
    <>
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
      >
        <Card className="border-border hover:shadow-lg hover:border-primary/20 transition-all duration-200 cursor-pointer group flex flex-col h-full">
          <CardContent className="p-5 flex flex-col h-full">
            {/* Header with Icon and Category */}
            <div className="flex items-start justify-between mb-4">
              <div
                className={`${colors.bg} ${colors.text} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <Badge
                variant="outline"
                className={`${colors.bg} ${colors.text} ${colors.border}`}
              >
                {applet.category}
              </Badge>
            </div>

            {/* Title and Provider */}
            <div className="mb-3">
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {applet.name}
              </h3>
              <p className="text-xs text-muted-foreground">{applet.provider}</p>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {applet.description}
            </p>

            {/* Metrics Grid */}
            {applet.metrics && (
              <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
                {applet.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-muted/50 p-2 rounded-lg border border-border/50">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                      {metric.label}
                    </p>
                    <p className="text-xs font-medium text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Contract Hash Display */}
            {applet.contractHash && (
              <div className="mb-4 p-2 bg-muted/50 rounded text-[10px] font-mono text-muted-foreground break-all border border-border/50">
                <span className="font-semibold select-none">ID: </span>
                {applet.contractHash.slice(0, 10)}...{applet.contractHash.slice(-8)}
              </div>
            )}

            {/* Footer with Gas Cost and Action */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Fuel className="w-4 h-4" />
                <span className="text-sm font-medium">{applet.gasCost}</span>
                <span className="text-xs">WEI</span>
              </div>
              <Button
                size="sm"
                onClick={() => setIsInvokeModalOpen(true)}
                disabled={!isWalletConnected}
                className="gap-1.5 bg-primary hover:bg-primary-light text-primary-foreground group-hover:gap-2.5 transition-all duration-200"
              >
                Execute
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Invoke Modal */}
      <InvokeModal
        applet={applet}
        isOpen={isInvokeModalOpen}
        onClose={() => setIsInvokeModalOpen(false)}
      />
    </>
  );
}
