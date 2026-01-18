import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { endpoints } from "@/services/api";
import { useEffect } from "react";
import AppletCard from "./AppletCard";
import CategoryFilter from "./CategoryFilter";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface AppletMarketplaceProps {
  isWalletConnected: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function AppletMarketplace({
  isWalletConnected,
  selectedCategory,
  onCategoryChange,
}: AppletMarketplaceProps) {
  const [applets, setApplets] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name_asc" | "name_desc" | "gas_asc" | "gas_desc">("name_asc");

  useEffect(() => {
    endpoints.applets.list().then(setApplets).catch(console.error);
  }, []);

  const filteredApplets = applets
    .filter((applet) => {
      const matchesCategory = selectedCategory === "all" || applet.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        applet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        applet.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "gas_asc":
          return a.gasCost - b.gasCost;
        case "gas_desc":
          return b.gasCost - a.gasCost;
        case "name_desc":
          return b.name.localeCompare(a.name);
        case "name_asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Applet Marketplace</CardTitle>
          <CardDescription>
            Discover and execute cross-pod applets on the WeilChain network
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search applets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-input border-border"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 border-border">
                  <SlidersHorizontal className="w-4 h-4" />
                  Sort by
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("name_asc")}>
                  Name (A-Z)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name_desc")}>
                  Name (Z-A)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("gas_asc")}>
                  Gas Cost (Low to High)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("gas_desc")}>
                  Gas Cost (High to Low)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category Filter */}
          <CategoryFilter selected={selectedCategory} onSelect={onCategoryChange} />

          {/* Applet Grid */}
          <div className="min-h-[400px]">
            {filteredApplets.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Filter className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No applets found</h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCategory + searchQuery + sortBy}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.05
                      }
                    }
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  {filteredApplets.map((applet) => (
                    <motion.div
                      key={applet.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <AppletCard applet={applet} isWalletConnected={isWalletConnected} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
