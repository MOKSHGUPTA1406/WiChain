import { motion, AnimatePresence } from 'motion/react';
import { X, Zap, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface AppletInvokeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  applet: {
    id: string;
    name: string;
    provider: string;
    description: string;
    gasCost: number;
  } | null;
  onConfirm: (appletId: string, params: Record<string, string>) => void;
}

export function AppletInvokeSheet({ isOpen, onClose, applet, onConfirm }: AppletInvokeSheetProps) {
  const [params, setParams] = useState<Record<string, string>>({});

  if (!applet) return null;

  const handleConfirm = () => {
    onConfirm(applet.id, params);
    onClose();
    setParams({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 bg-white rounded-t-3xl z-50 max-h-[85vh] flex flex-col"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-lg font-semibold text-foreground">{applet.name}</h2>
                <p className="text-sm text-muted-foreground">{applet.provider}</p>
              </div>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center"
                whileTap={{ scale: 0.96 }}
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <p className="text-sm text-foreground/80 mb-6">{applet.description}</p>

              {/* Parameters */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Input Data (Optional)
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-sm text-input-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter parameters..."
                    value={params.input || ''}
                    onChange={(e) => setParams({ ...params, input: e.target.value })}
                  />
                </div>

                {/* Gas Estimate */}
                <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground mb-0.5">Estimated Gas Fee</p>
                    <p className="text-xs text-muted-foreground">This transaction will cost approximately:</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{applet.gasCost} WEI</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border safe-area-bottom">
              <div className="flex gap-3">
                <motion.button
                  onClick={onClose}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-xl font-medium"
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Zap className="w-4 h-4" />
                  Execute Applet
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
