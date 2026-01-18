import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Calendar,
  Search,
  Download,
  ExternalLink,
  TrendingUp,
  Activity as ActivityIcon,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Separator } from "../components/ui/separator";

interface ActivityPageProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

import { endpoints } from "@/services/api";
// ... imports

const statusConfig = {
  success: {
    icon: CheckCircle2,
    label: "Success",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/20",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    borderColor: "border-destructive/20",
  },
  pending: {
    icon: Clock,
    label: "Pending",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/20",
  },
};

export default function ActivityPage({ isWalletConnected }: ActivityPageProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isWalletConnected) {
      loadActivities();
    }
  }, [isWalletConnected]);

  const loadActivities = async () => {
    try {
      const data = await endpoints.executions.list();
      setActivities(data);
    } catch (error) {
      console.error("Failed to load activities", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredActivity = activities.filter((item) => {
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      (item.applet?.name || item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.txHash || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: activities.length,
    success: activities.filter((i) => i.status === "success").length,
    failed: activities.filter((i) => i.status === "failed").length,
    pending: activities.filter((i) => i.status === "pending").length,
  };

  if (!isWalletConnected) {
    return (
      <div className="h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ActivityIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Connect Your Wallet</h2>
          <p className="text-muted-foreground">
            Please connect your wallet to view your activity history
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-semibold text-foreground mb-2">Activity</h1>
            <p className="text-muted-foreground">View all your applet execution history</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-6">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-4 gap-6"
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-3xl font-semibold text-foreground">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-success/20 bg-success/5">
            <CardContent className="p-6">
              <p className="text-sm text-success/80 mb-1">Success</p>
              <p className="text-3xl font-semibold text-success">{stats.success}</p>
            </CardContent>
          </Card>
          <Card className="border-destructive/20 bg-destructive/5">
            <CardContent className="p-6">
              <p className="text-sm text-destructive/80 mb-1">Failed</p>
              <p className="text-3xl font-semibold text-destructive">{stats.failed}</p>
            </CardContent>
          </Card>
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="p-6">
              <p className="text-sm text-warning/80 mb-1">Pending</p>
              <p className="text-3xl font-semibold text-warning">{stats.pending}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by applet name or transaction hash..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>
                Showing {filteredActivity.length} of {activities.length} executions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredActivity.map((item, index) => {
                  const config = statusConfig[item.status as keyof typeof statusConfig] || statusConfig.pending;
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      whileHover={{ x: 4, transition: { duration: 0.2 } }}
                      className="bg-muted rounded-lg p-5 border border-border hover:border-primary/20 transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`${config.bgColor} ${config.color} p-2.5 rounded-lg`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-foreground">{item.applet?.name || item.name}</h4>
                              <Badge
                                variant="outline"
                                className={`${config.bgColor} ${config.color} ${config.borderColor} text-xs`}
                              >
                                {config.label}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(item.timestamp).toLocaleString()}</span>
                              </div>
                              {/* Placeholder for missing txHash */}
                              <span>•</span>
                              <span className="font-mono">{item.id.substring(0, 10)}...</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-primary hover:text-primary-light"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                            {item.error && (
                              <p className="text-sm text-destructive">Error: {item.error}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          {item.status !== "pending" && (
                            <p className="font-semibold text-foreground">{item.fee || 0} WEI</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">{new Date(item.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {/* We might not have params stored in all execution records yet */}
                          <span className="font-medium">Applet ID:</span>{" "}
                          <code className="bg-background px-2 py-0.5 rounded">
                            {item.appletId}
                          </code>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
