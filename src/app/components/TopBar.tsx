import { motion } from 'motion/react';
import { Wallet, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TopBarProps {
  title: string;
  isConnected: boolean;
  walletAddress?: string;
  onConnect: () => void;
  rightAction?: React.ReactNode;
}

export function TopBar({ title, isConnected, walletAddress, onConnect, rightAction }: TopBarProps) {
  const [showWalletMenu, setShowWalletMenu] = useState(false);

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-border z-40">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        
        <div className="flex items-center gap-3">
          {rightAction}
          
          {isConnected && walletAddress ? (
            <motion.button
              onClick={() => setShowWalletMenu(!showWalletMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg"
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-2 h-2 bg-success rounded-full" />
              <span className="text-sm font-medium text-secondary-foreground">
                {walletAddress}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.button>
          ) : (
            <motion.button
              onClick={onConnect}
              className="flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium"
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Wallet className="w-4 h-4" />
              <span className="text-sm">Connect</span>
            </motion.button>
          )}
        </div>
      </div>
    </header>
  );
}
