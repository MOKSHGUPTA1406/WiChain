import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import ActivityPage from "./pages/ActivityPage";
import SettingsPage from "./pages/SettingsPage";
import NetworkStatus from "./components/NetworkStatus";

type Page = "home" | "portfolio" | "activity" | "settings";

import { endpoints } from "@/services/api";
import { connectSocket, disconnectSocket } from "@/services/socket";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    // Check if wallet is already connected via local storage
    const savedAddress = localStorage.getItem("walletAddress");
    if (savedAddress) {
      setWalletAddress(savedAddress);
      setIsWalletConnected(true);
      connectSocket(savedAddress);
    }

    // Listen for MetaMask account changes
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: any[]) => {
        if (accounts.length > 0) {
          const newAddress = accounts[0];
          endpoints.auth.login(newAddress).then((user) => {
            localStorage.setItem("walletAddress", user.walletAddress);
            setWalletAddress(user.walletAddress);
            setIsWalletConnected(true);
            connectSocket(user.walletAddress);
          });
        } else {
          handleDisconnectWallet();
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (window.ethereum && window.ethereum.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      }
    }
  }, []);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask to use this feature!");
      return;
    }

    try {
      // Force popup asking for account permission
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        const user = await endpoints.auth.login(address);

        localStorage.setItem("walletAddress", user.walletAddress);
        setWalletAddress(user.walletAddress);
        setIsWalletConnected(true);

        connectSocket(user.walletAddress);
        toast.success("Wallet Connected", {
          description: `Connected: ${address.slice(0, 6)}...${address.slice(-4)}`
        });
      }
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Failed to connect wallet");
    }
  };

  const handleDisconnectWallet = () => {
    localStorage.removeItem("walletAddress");
    setIsWalletConnected(false);
    setWalletAddress("");
    disconnectSocket();
  };

  const renderPage = () => {
    const pageProps = {
      isWalletConnected,
      walletAddress,
    };

    switch (currentPage) {
      case "home":
        return <HomePage {...pageProps} />;
      case "portfolio":
        return <PortfolioPage {...pageProps} />;
      case "activity":
        return <ActivityPage {...pageProps} />;
      case "settings":
        return <SettingsPage {...pageProps} />;
      default:
        return <HomePage {...pageProps} />;
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page as Page)}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        onConnectWallet={handleConnectWallet}
        onDisconnectWallet={handleDisconnectWallet}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="min-h-full"
        >
          {renderPage()}
        </motion.div>
      </main>

      {/* Network Status Indicator */}
      <NetworkStatus />

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}
