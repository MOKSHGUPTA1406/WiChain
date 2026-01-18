import { Coins, Map } from 'lucide-react';

interface WalletOverviewProps {
  balance: number;
  pod: string;
  stake?: number;
}

export function WalletOverview({ balance, pod, stake }: WalletOverviewProps) {
  return (
    <div className="bg-[#0d1220] border border-[#1a2332] rounded-xl p-6">
      <h3 className="text-white mb-6">Wallet Overview</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between py-3 border-b border-[#1a2332]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00ff88] to-[#00cc6a] rounded-lg flex items-center justify-center">
              <Coins className="w-5 h-5 text-[#0a0e1a]" />
            </div>
            <span className="text-sm text-gray-400">Balance</span>
          </div>
          <span className="text-lg text-[#00ff88]">{balance} WEIL</span>
        </div>

        {stake && (
          <div className="flex items-center justify-between py-3 border-b border-[#1a2332]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1a2332] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gray-400" />
              </div>
              <span className="text-sm text-gray-400">Staked</span>
            </div>
            <span className="text-sm text-gray-300">{stake}</span>
          </div>
        )}

        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1a2332] rounded-lg flex items-center justify-center">
              <Map className="w-5 h-5 text-gray-400" />
            </div>
            <span className="text-sm text-gray-400">Pod</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">{pod}</span>
            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
      />
    </svg>
  );
}
