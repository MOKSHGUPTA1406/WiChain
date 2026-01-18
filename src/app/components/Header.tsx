import { Search, Wallet } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: () => void;
}

export function Header({ isConnected, walletAddress, onConnect }: HeaderProps) {
  return (
    <header className="h-20 bg-[#0d1220] border-b border-[#1a2332] px-8 flex items-center justify-between">
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search applets..."
            className="w-full bg-[#1a2332] border border-[#2a3442] rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00ff88] transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isConnected ? (
          <div className="flex items-center gap-3 bg-[#1a2332] border border-[#00ff88]/20 rounded-lg px-4 py-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-full flex items-center justify-center">
              <span className="text-[#0a0e1a] text-xs font-bold">W</span>
            </div>
            <span className="text-[#00ff88] text-sm">{walletAddress}</span>
          </div>
        ) : (
          <Button
            onClick={onConnect}
            className="bg-[#00ff88] hover:bg-[#00cc6a] text-[#0a0e1a] px-6 py-2.5 rounded-lg transition-all flex items-center gap-2"
          >
            <Wallet className="w-4 h-4" />
            <span>Connect Wallet</span>
          </Button>
        )}
      </div>
    </header>
  );
}
