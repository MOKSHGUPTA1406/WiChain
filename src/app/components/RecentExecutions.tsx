import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, Clock, Activity, Trash2 } from "lucide-react";
import { endpoints } from "@/services/api";
import { getSocket } from "@/services/socket";
import { usePersonalization } from "@/app/context/PersonalizationContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "sonner";

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Success",
  },
  failed: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Failed",
  },
  pending: {
    icon: Clock,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Pending",
  },
};

interface RecentExecutionsProps {
  isWalletConnected?: boolean;
  limit?: number;
}

export default function RecentExecutions({ isWalletConnected, limit }: RecentExecutionsProps) {
  const [executions, setExecutions] = useState<any[]>([]);
  const { compactMode } = usePersonalization();

  useEffect(() => {
    loadExecutions();

    const socket = getSocket();
    if (socket) {
      socket.on("execution_update", handleExecutionUpdate);
    }

    return () => {
      if (socket) {
        socket.off("execution_update", handleExecutionUpdate);
      }
    };
  }, [isWalletConnected]);

  const loadExecutions = async () => {
    try {
      const data = await endpoints.executions.list();

      // Filter based on "cleared" timestamp
      const clearedAt = localStorage.getItem("recentActivityClearedAt");
      if (clearedAt) {
        const threshold = parseInt(clearedAt);
        const filtered = data.filter((e: any) => new Date(e.timestamp).getTime() > threshold);
        setExecutions(filtered);
      } else {
        setExecutions(data);
      }
    } catch (error) {
      console.error("Failed to load executions", error);
    }
  };

  const handleClearHistory = async () => {
    if (!confirm("Clear this list?")) return;

    try {
      // Soft clear: just hide current items from this specific view
      localStorage.setItem("recentActivityClearedAt", Date.now().toString());
      setExecutions([]);
      toast.success("Recent activity cleared from view");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  const handleExecutionUpdate = (updatedExecution: any) => {
    setExecutions((prev) => {
      // Check if exists
      const exists = prev.find((e) => e.id === updatedExecution.id);

      if (exists) {
        // Show toast on completion
        if (exists.status === 'pending' && updatedExecution.status !== 'pending') {
          toast(updatedExecution.status === 'success' ? 'Execution Successful' : 'Execution Failed', {
            description: `Applet: ${updatedExecution.applet.name}`,
          });
        }
        return prev.map((e) => (e.id === updatedExecution.id ? updatedExecution : e));
      } else {
        // Add new
        toast("New Execution Started", {
          description: `Applet: ${updatedExecution.applet.name}`,
        });
        return [updatedExecution, ...prev];
      }
    });
  };

  return (
    <Card className="border-border h-fit sticky top-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
          {executions.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <CardDescription>Your latest applet executions</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {(limit ? executions.slice(0, limit) : executions).map((execution, index) => {
                const config = statusConfig[execution.status as keyof typeof statusConfig] || statusConfig.pending;
                const Icon = config.icon;

                return (
                  <motion.div
                    key={execution.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`bg-muted rounded-lg border border-border hover:border-primary/20 transition-all duration-200 cursor-pointer ${compactMode ? "p-2 mb-1.5" : "p-4 mb-3"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className={`font-medium text-foreground mb-1 ${compactMode ? "text-xs" : "text-sm"}`}>
                          {execution.applet?.name || execution.name}
                        </h4>
                        <p className={`text-muted-foreground ${compactMode ? "text-[10px]" : "text-xs"}`}>
                          {new Date(execution.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className={`${config.bgColor} ${config.color} ${compactMode ? "p-1" : "p-1.5"} rounded-lg`}>
                        <Icon className={`${compactMode ? "w-3 h-3" : "w-3.5 h-3.5"}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant="outline"
                        className={`${config.bgColor} ${config.color} border-transparent ${compactMode ? "text-[10px] px-1.5 py-0" : "text-xs"}`}
                      >
                        {config.label}
                      </Badge>
                      {execution.fee && (
                        <span className={`text-muted-foreground ${compactMode ? "text-[10px]" : "text-xs"}`}>{execution.fee} WEI</span>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
