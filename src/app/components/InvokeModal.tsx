import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, CheckCircle2, AlertCircle, Fuel, Clock, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import SuccessAnimation from "./SuccessAnimation";
import { endpoints } from "@/services/api";

interface Applet {
  id: string;
  name: string;
  provider: string;
  category: string;
  description: string;
  gasCost: number;
  icon: string;
  estTime?: string;
  securityStatus?: string;
  version?: string;
  compliance?: string;
  metrics?: { label: string; value: string }[];
}

interface InvokeModalProps {
  applet: Applet;
  isOpen: boolean;
  onClose: () => void;
}

type ExecutionState = "idle" | "executing" | "success" | "error";

export default function InvokeModal({ applet, isOpen, onClose }: InvokeModalProps) {
  const [executionState, setExecutionState] = useState<ExecutionState>("idle");
  const [inputParams, setInputParams] = useState("");
  const [txHash, setTxHash] = useState("");
  const [maxGasPrice, setMaxGasPrice] = useState<number>(Infinity);

  useEffect(() => {
    if (isOpen) {
      endpoints.settings.get().then((settings) => {
        if (settings) setMaxGasPrice(settings.maxGasPrice);
      }).catch(console.error);
    }
  }, [isOpen]);

  const handleExecute = async () => {
    if (applet.gasCost > maxGasPrice) {
      toast.error("Gas Limit Exceeded", {
        description: `Applet gas cost (${applet.gasCost} WEI) exceeds your max setting (${maxGasPrice} WEI).`
      });
      return;
    }

    setExecutionState("executing");
    let activeAccount: string;

    try {
      // 1. Ensure Connected to Localhost (1337)
      const targetChainId = "0x539"; // 1337
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });

      if (currentChainId !== targetChainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: targetChainId,
                    chainName: 'Localhost 8545',
                    rpcUrls: ['http://localhost:8545'],
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                  },
                ],
              });
            } catch (addError) {
              throw new Error("Failed to add Localhost network to MetaMask.");
            }
          } else {
            throw new Error("Failed to switch to Localhost network.");
          }
        }
      }
      // Verify current connected account from wallet
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      activeAccount = accounts[0];

      if (!activeAccount) throw new Error("No wallet account detected");

      // Request Wallet Transaction
      const sanitizedGasCost = Math.floor(applet.gasCost);
      const valueHex = "0x" + sanitizedGasCost.toString(16);
      const toAddress = (applet as any).contractHash || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";

      const txParams = {
        from: activeAccount,
        to: toAddress,
        value: valueHex,
      };

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });

    } catch (txError: any) {
      console.error("Transaction failed", txError);

      // Check for User Rejection
      if (txError.code === 4001 || txError?.message?.includes("rejected")) {
        toast.error("Transaction Rejected", {
          description: "You rejected the transaction in your wallet."
        });
      } else {
        let errorMessage = txError?.message || "An unknown error occurred.";
        if (txError?.data?.message) {
          errorMessage = txError.data.message;
        } else if (txError?.message?.includes("Internal JSON-RPC error")) {
          errorMessage = "Internal JSON-RPC error. Try resetting your account in MetaMask (Settings > Advanced > Clear Activity).";
        }
        toast.error("Transaction Failed", { description: errorMessage });
      }

      setExecutionState("idle");
      return;
    }

    try {
      // Use the activeAccount we successfully used for the transaction
      const execution = await endpoints.executions.create(applet.id, activeAccount);

      // Listen for socket update
      const socket = (await import("@/services/socket")).getSocket();

      if (socket) {
        const handleUpdate = (updatedExecution: any) => {
          if (updatedExecution.id === execution.id && updatedExecution.status !== 'pending') {
            socket.off('execution_update', handleUpdate);
            if (updatedExecution.status === 'success') {
              setExecutionState("success");
              setTxHash(updatedExecution.id);
              setTimeout(() => handleClose(), 2000);
            } else {
              setExecutionState("error");
            }
          }
        };
        socket.on('execution_update', handleUpdate);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setExecutionState("success");
        handleClose();
      }

    } catch (error) {
      console.error("Execution failed", error);
      setExecutionState("error");
    }
  };

  const handleClose = () => {
    setExecutionState("idle");
    setInputParams("");
    setTxHash("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Execute Applet</DialogTitle>
          <DialogDescription>{applet.name}</DialogDescription>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {executionState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Applet Info */}
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{applet.name}</p>
                    <p className="text-xs text-muted-foreground">{applet.provider}</p>
                  </div>
                  <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                    {applet.category}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{applet.description}</p>

                {/* Metrics Badges */}
                {applet.metrics && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {applet.metrics.map((m, i) => (
                      <div key={i} className="flex items-center text-[10px] bg-background border border-border px-2 py-1 rounded-md">
                        <span className="text-muted-foreground mr-1">{m.label}:</span>
                        <span className="font-semibold">{m.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Execution Details */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Fuel className="w-4 h-4" />
                    <span>Gas Cost</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {applet.gasCost} WEI
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Est. Time</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {applet.estTime || "~2-3 seconds"}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4" />
                    <span>Security</span>
                  </div>
                  <span className="text-sm font-medium text-success">
                    {applet.securityStatus || "Verified"}
                  </span>
                </div>

                {/* Extra Details Row */}
                <div className="flex items-center justify-between py-2">
                  <div className="text-xs text-muted-foreground">
                    Version: <span className="text-foreground font-mono">{applet.version || "v1.0.0"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Compliance: <span className="text-foreground font-mono">{applet.compliance || "None"}</span>
                  </div>
                </div>
              </div>

              {/* Optional Parameters */}
              <div className="space-y-2">
                <Label htmlFor="params">Parameters (Optional)</Label>
                <Input
                  id="params"
                  placeholder="Enter JSON parameters..."
                  value={inputParams}
                  onChange={(e) => setInputParams(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleExecute} className="flex-1 bg-primary hover:bg-primary-light">
                  Execute Applet
                </Button>
              </div>
            </motion.div>
          )}

          {executionState === "executing" && (
            <motion.div
              key="executing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-12 flex flex-col items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="mb-6"
              >
                <Loader2 className="w-12 h-12 text-primary" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Executing Applet</h3>
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we process your transaction...
              </p>
            </motion.div>
          )}

          {executionState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-12 flex flex-col items-center justify-center"
            >
              <SuccessAnimation />
              <h3 className="text-lg font-semibold text-foreground mb-2">Execution Successful!</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Your applet has been executed successfully
              </p>
              <div className="w-full bg-muted rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                <p className="text-xs font-mono text-foreground break-all">{txHash}</p>
              </div>
            </motion.div>
          )}

          {executionState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="py-12 flex flex-col items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-6"
              >
                <AlertCircle className="w-12 h-12 text-destructive" />
              </motion.div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Execution Failed</h3>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Network congestion detected. Please try again.
              </p>
              <div className="flex gap-3 w-full">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setExecutionState("idle");
                    handleExecute();
                  }}
                  className="flex-1 bg-primary hover:bg-primary-light"
                >
                  Retry
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
