import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { usePersonalization } from "@/app/context/PersonalizationContext";
import { endpoints } from "@/services/api";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Zap,
  Lock,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { toast } from "sonner";
import { Slider } from "../components/ui/slider";
import { Badge } from "../components/ui/badge";
import AddNetworkModal from "../components/AddNetworkModal";
import { Plus } from "lucide-react";

interface SettingsPageProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

export default function SettingsPage({ isWalletConnected, walletAddress }: SettingsPageProps) {
  const { setTheme, theme } = useTheme();
  const { compactMode, setCompactMode } = usePersonalization();

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [executionAlerts, setExecutionAlerts] = useState(true);
  const [marketplaceUpdates, setMarketplaceUpdates] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  // Privacy Settings
  const [showBalance, setShowBalance] = useState(true);
  const [showActivity, setShowActivity] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  // Network Settings
  const [network, setNetwork] = useState("mainnet");
  const [autoGasOptimization, setAutoGasOptimization] = useState(true);
  const [maxGasPrice, setMaxGasPrice] = useState([500]);
  const [isAddNetworkOpen, setIsAddNetworkOpen] = useState(false);

  // Advanced Settings
  const [slippageTolerance, setSlippageTolerance] = useState([0.5]);
  const [transactionDeadline, setTransactionDeadline] = useState("20");

  // Fetch settings on load
  useEffect(() => {
    if (isWalletConnected) {
      endpoints.settings.get().then((data) => {
        if (data) {
          setEmailNotifications(data.emailNotifications);
          setExecutionAlerts(data.executionAlerts);
          setMarketplaceUpdates(data.marketplaceUpdates);
          setSecurityAlerts(data.securityAlerts);
          setShowBalance(data.showBalance);
          setShowActivity(data.showActivity);
          setAnalyticsEnabled(data.analyticsEnabled);
          setNetwork(data.network);
          setAutoGasOptimization(data.autoGasOptimization);
          setMaxGasPrice([data.maxGasPrice]);
          setSlippageTolerance([data.slippageTolerance]);
          setTransactionDeadline(data.transactionDeadline.toString());
        }
      }).catch(console.error);
    }
  }, [isWalletConnected]);

  const handleSaveSettings = async () => {
    try {
      await endpoints.settings.save({
        emailNotifications,
        executionAlerts,
        marketplaceUpdates,
        securityAlerts,
        showBalance,
        showActivity,
        analyticsEnabled,
        network,
        autoGasOptimization,
        maxGasPrice: maxGasPrice[0],
        slippageTolerance: slippageTolerance[0],
        transactionDeadline: parseInt(transactionDeadline),
      });

      toast.success("Settings saved successfully", {
        description: "Your preferences have been updated",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save settings");
    }
  };

  const handleResetSettings = async () => {
    // Reset to defaults
    const defaults = {
      emailNotifications: true,
      executionAlerts: true,
      marketplaceUpdates: false,
      securityAlerts: true,
      showBalance: true,
      showActivity: true,
      analyticsEnabled: true,
      network: "mainnet",
      autoGasOptimization: true,
      maxGasPrice: 500,
      slippageTolerance: 0.5,
      transactionDeadline: 20
    };

    setEmailNotifications(defaults.emailNotifications);
    setExecutionAlerts(defaults.executionAlerts);
    setMarketplaceUpdates(defaults.marketplaceUpdates);
    setSecurityAlerts(defaults.securityAlerts);
    setShowBalance(defaults.showBalance);
    setShowActivity(defaults.showActivity);
    setAnalyticsEnabled(defaults.analyticsEnabled);
    setNetwork(defaults.network);
    setAutoGasOptimization(defaults.autoGasOptimization);
    setMaxGasPrice([defaults.maxGasPrice]);
    setSlippageTolerance([defaults.slippageTolerance]);
    setTransactionDeadline(defaults.transactionDeadline.toString());

    try {
      await endpoints.settings.save(defaults);
      toast.success("Settings reset to defaults");
    } catch (error) {
      toast.error("Failed to reset settings");
    }
  };

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-b border-border">
        <div className="max-w-5xl mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-semibold text-foreground mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your preferences and configure the application
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-8 py-8 space-y-6">
        {/* Appearance & Personalization */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel of the dashboard</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <div className="flex bg-secondary p-1 rounded-lg">
                  {["light", "dark", "system"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${theme === t
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="compact-mode" className="cursor-pointer">
                    Compact Mode
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Reduce spacing for a denser information display
                  </p>
                </div>
                <Switch
                  id="compact-mode"
                  checked={compactMode}
                  onCheckedChange={setCompactMode}
                />
              </div>

            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary p-2.5 rounded-lg">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Configure how you receive updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="email-notifications" className="cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive email updates about your account
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="execution-alerts" className="cursor-pointer">
                    Execution Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Get notified when applets complete execution
                  </p>
                </div>
                <Switch
                  id="execution-alerts"
                  checked={executionAlerts}
                  onCheckedChange={setExecutionAlerts}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="marketplace-updates" className="cursor-pointer">
                    Marketplace Updates
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Stay informed about new applets and features
                  </p>
                </div>
                <Switch
                  id="marketplace-updates"
                  checked={marketplaceUpdates}
                  onCheckedChange={setMarketplaceUpdates}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="security-alerts" className="cursor-pointer">
                    Security Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Important security and account notifications
                  </p>
                </div>
                <Switch
                  id="security-alerts"
                  checked={securityAlerts}
                  onCheckedChange={setSecurityAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy & Security */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-accent/10 text-accent p-2.5 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Privacy & Security</CardTitle>
                  <CardDescription>Control your data and visibility</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="show-balance" className="cursor-pointer">
                      Show Wallet Balance
                    </Label>
                    {showBalance ? (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Display your balance in the interface
                  </p>
                </div>
                <Switch
                  id="show-balance"
                  checked={showBalance}
                  onCheckedChange={setShowBalance}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="show-activity" className="cursor-pointer">
                    Public Activity
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Allow others to see your execution history
                  </p>
                </div>
                <Switch
                  id="show-activity"
                  checked={showActivity}
                  onCheckedChange={setShowActivity}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="analytics" className="cursor-pointer">
                    Analytics & Usage Data
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Help improve the platform with anonymous usage data
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={analyticsEnabled}
                  onCheckedChange={setAnalyticsEnabled}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Network Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-success/10 text-success p-2.5 rounded-lg">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Network & Gas</CardTitle>
                  <CardDescription>Configure blockchain network settings</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="network">Network</Label>
                <div className="flex gap-2">
                  <Select value={network} onValueChange={setNetwork}>
                    <SelectTrigger id="network" className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mainnet">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full" />
                          <span>WeilChain Mainnet</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="testnet">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-warning rounded-full" />
                          <span>WeilChain Testnet</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="devnet">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                          <span>WeilChain Devnet</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setIsAddNetworkOpen(true)} title="Add Custom Network">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <AddNetworkModal isOpen={isAddNetworkOpen} onClose={() => setIsAddNetworkOpen(false)} />

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="auto-gas" className="cursor-pointer">
                    Auto Gas Optimization
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Automatically optimize gas fees for transactions
                  </p>
                </div>
                <Switch
                  id="auto-gas"
                  checked={autoGasOptimization}
                  onCheckedChange={setAutoGasOptimization}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Max Gas Price</Label>
                  <Badge variant="outline">{maxGasPrice[0]} WEI</Badge>
                </div>
                <Slider
                  value={maxGasPrice}
                  onValueChange={setMaxGasPrice}
                  min={100}
                  max={1000}
                  step={50}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Transactions will not execute if gas exceeds this price
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Advanced Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="border-border">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-warning/10 text-warning p-2.5 rounded-lg">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Fine-tune execution parameters</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Slippage Tolerance</Label>
                  <Badge variant="outline">{slippageTolerance[0]}%</Badge>
                </div>
                <Slider
                  value={slippageTolerance}
                  onValueChange={setSlippageTolerance}
                  min={0.1}
                  max={5}
                  step={0.1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum price movement tolerance for transactions
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label htmlFor="deadline">Transaction Deadline (minutes)</Label>
                <Input
                  id="deadline"
                  type="number"
                  value={transactionDeadline}
                  onChange={(e) => setTransactionDeadline(e.target.value)}
                  min="1"
                  max="60"
                />
                <p className="text-xs text-muted-foreground">
                  Transactions will revert if they remain pending longer than this
                </p>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex gap-3">
                <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Advanced Settings Notice</p>
                  <p>
                    Modifying these settings may affect transaction success rates. Only change if
                    you understand the implications.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex items-center justify-between pt-4"
        >
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSaveSettings} className="gap-2 bg-primary hover:bg-primary-light">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </motion.div>

        {/* Account Info */}
        {isWalletConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            <Card className="border-border bg-muted/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Connected Wallet</p>
                      <p className="font-mono text-sm font-medium text-foreground break-all">
                        {isWalletConnected ? walletAddress : "Not Connected"}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-success text-success-foreground">Verified</Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
