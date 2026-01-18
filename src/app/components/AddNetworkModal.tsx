import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Loader2, Plus, Globe } from "lucide-react";
import { toast } from "sonner";

interface AddNetworkModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddNetworkModal({ isOpen, onClose }: AddNetworkModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        chainId: "",
        chainName: "",
        rpcUrl: "",
        symbol: "",
        explorerUrl: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleAddNetwork = async () => {
        // Basic validation
        if (!formData.chainId || !formData.chainName || !formData.rpcUrl || !formData.symbol) {
            toast.error("Missing Fields", {
                description: "Please fill in all required fields."
            });
            return;
        }

        setLoading(true);

        try {
            if (!window.ethereum) throw new Error("No wallet found");

            // Chain ID must be hex
            const chainIdHex = "0x" + parseInt(formData.chainId).toString(16);

            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: chainIdHex,
                        chainName: formData.chainName,
                        rpcUrls: [formData.rpcUrl],
                        nativeCurrency: {
                            name: formData.symbol,
                            symbol: formData.symbol,
                            decimals: 18,
                        },
                        blockExplorerUrls: formData.explorerUrl ? [formData.explorerUrl] : [],
                    },
                ],
            });

            toast.success("Network Added", {
                description: `${formData.chainName} has been added to your wallet.`
            });
            onClose();
        } catch (error: any) {
            console.error("Failed to add network", error);
            toast.error("Failed to Add Network", {
                description: error.message || "User rejected the request."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Custom Network</DialogTitle>
                    <DialogDescription>
                        Enter the network details to add it to your wallet.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="chainName">Network Name</Label>
                        <Input
                            id="chainName"
                            placeholder="e.g. WeilChain Mainnet"
                            value={formData.chainName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="rpcUrl">RPC URL</Label>
                        <Input
                            id="rpcUrl"
                            placeholder="https://rpc.example.com"
                            value={formData.rpcUrl}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="chainId">Chain ID</Label>
                            <Input
                                id="chainId"
                                placeholder="e.g. 1337"
                                type="number"
                                value={formData.chainId}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="symbol">Currency Symbol</Label>
                            <Input
                                id="symbol"
                                placeholder="e.g. WEIL"
                                value={formData.symbol}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="explorerUrl">Block Explorer URL (Optional)</Label>
                        <Input
                            id="explorerUrl"
                            placeholder="https://explorer.example.com"
                            value={formData.explorerUrl}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddNetwork} disabled={loading} className="gap-2">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Add Network
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
