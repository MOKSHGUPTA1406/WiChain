import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, ArrowUpRight, Zap, Activity, Shield } from "lucide-react";
import AppletMarketplace from "../components/AppletMarketplace";
import RecentExecutions from "../components/RecentExecutions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

interface HomePageProps {
  isWalletConnected: boolean;
  walletAddress: string;
}

export default function HomePage({ isWalletConnected }: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const stats = [
    {
      label: "Total Executions",
      value: "1,284",
      change: "+12.5%",
      icon: Zap,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Active Applets",
      value: "47",
      change: "+3",
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Network Health",
      value: "99.8%",
      change: "Stable",
      icon: Shield,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="h-full">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-transparent border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Welcome to Wi-Chain Portal
            </h1>
            <p className="text-muted-foreground">
              Discover and execute decentralized applets on the WeilChain network
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="border-border hover:shadow-md transition-all duration-200 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                        <p className="text-2xl font-semibold text-foreground mb-2">
                          {stat.value}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                          <TrendingUp className="w-3 h-3 text-success" />
                          <span className="text-success font-medium">{stat.change}</span>
                        </div>
                      </div>
                      <div className={`${stat.bgColor} ${stat.color} p-3 rounded-xl`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Actions Banner */}
        {isWalletConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      Ready to execute applets
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your wallet is connected. Browse the marketplace below to get started.
                    </p>
                  </div>
                  <Badge className="bg-accent text-accent-foreground">
                    Connected <ArrowUpRight className="w-3 h-3 ml-1" />
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main Content - Applet Marketplace */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="col-span-2"
          >
            <AppletMarketplace
              isWalletConnected={isWalletConnected}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </motion.div>

          {/* Sidebar - Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="col-span-1"
          >
            <RecentExecutions isWalletConnected={isWalletConnected} limit={5} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
