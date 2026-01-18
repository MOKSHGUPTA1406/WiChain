import { useState } from "react";
import { motion } from "motion/react";
import { Home, Briefcase, Activity, Settings, Wallet, LogOut, Zap, Eye, EyeOff } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isWalletConnected: boolean;
  walletAddress: string;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({
  currentPage,
  onPageChange,
  isWalletConnected,
  walletAddress,
  onConnectWallet,
  onDisconnectWallet,
}: SidebarProps) {
  const [isAddressVisible, setIsAddressVisible] = useState(false);

  // Format address helper
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    if (isAddressVisible) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      {/* Logo & Branding */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Wi-Chain</h1>
            <p className="text-xs text-muted-foreground">Portal</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Wallet Connection */}
      <div className="p-4">
        {!isWalletConnected ? (
          <Button
            onClick={onConnectWallet}
            className="w-full bg-primary hover:bg-primary-light text-primary-foreground transition-all duration-200"
            size="lg"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-muted rounded-lg p-3 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Connected</span>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 h-5 px-1.5 min-w-0">
                  Active
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 min-w-[32px] bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Wallet</span>
                  <button onClick={() => setIsAddressVisible(!isAddressVisible)} className="text-muted-foreground hover:text-foreground">
                    {isAddressVisible ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <span className="text-sm font-mono text-foreground truncate" title={walletAddress}>
                  {formatAddress(walletAddress)}
                </span>
              </div>
            </div>

            <Button
              onClick={onDisconnectWallet}
              variant="outline"
              size="sm"
              className="w-full border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
            >
              <LogOut className="w-3 h-3 mr-2" />
              Disconnect
            </Button>
          </motion.div>
        )}
      </div>

      <Separator />

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  className="ml-auto w-1.5 h-1.5 bg-primary-foreground rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground space-y-1">
          <p>WeilChain Network</p>
          <p className="text-[10px]">v1.0.0 • Mainnet</p>
        </div>
      </div>
    </aside>
  );
}
