import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";

type NetworkStatus = "online" | "offline" | "slow";

export default function NetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>("online");

  useEffect(() => {
    // Simulate network status changes for demo
    const interval = setInterval(() => {
      const rand = Math.random();
      if (rand > 0.95) {
        setStatus("slow");
        setTimeout(() => setStatus("online"), 3000);
      } else if (rand > 0.98) {
        setStatus("offline");
        setTimeout(() => setStatus("online"), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const config = {
    online: {
      icon: Wifi,
      label: "Online",
      color: "bg-success text-success-foreground",
      iconColor: "text-success",
    },
    offline: {
      icon: WifiOff,
      label: "Offline",
      color: "bg-destructive text-destructive-foreground",
      iconColor: "text-destructive",
    },
    slow: {
      icon: AlertCircle,
      label: "Slow Connection",
      color: "bg-warning text-warning-foreground",
      iconColor: "text-warning",
    },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <AnimatePresence>
      {status !== "online" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Badge className={`${current.color} px-4 py-2 shadow-lg gap-2`}>
            <Icon className="w-4 h-4" />
            <span className="font-medium">{current.label}</span>
          </Badge>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
