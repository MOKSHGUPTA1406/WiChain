# Wi-Chain Portal - Decentralized Applet Marketplace

A production-ready DApp for discovering, authenticating, and executing cross-pod applets on the WeilChain network.

## 🌟 Features

- **Wallet Integration**: Secure authentication using Weil-SDK and KeyManager
- **Applet Marketplace**: Browse and discover decentralized applets across multiple categories (AI, Oracle, Audit, Storage, DeFi, Compute)
- **Dynamic Execution**: Invoke on-chain services with customizable parameters
- **Real-time Dashboard**: Monitor transaction status and execution history
- **Cross-Pod Support**: Execute applets across different network pods
- **Dark Mode UI**: Futuristic design with neon green accents

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Build Tool**: Vite

### Backend (WASM Applets)
- **Language**: Rust (targeting wasm32-unknown-unknown)
- **Features**: 
  - State persistence via WeilChain APIs
  - HTLC (Hashed Time-Locked Contracts) for atomic swaps
  - Authorization with `#[no_mangle]` entry points

## 📁 Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   ├── Header.tsx           # Top header with search & wallet
│   │   │   ├── AppletCard.tsx       # Applet display cards
│   │   │   ├── RecentExecutions.tsx # Transaction status panel
│   │   │   ├── WalletOverview.tsx   # Wallet balance & pod info
│   │   │   └── InvokeModal.tsx      # Applet execution modal
│   │   ├── data/
│   │   │   └── mockData.ts          # Mock applet & execution data
│   │   └── App.tsx                  # Main application component
│   └── styles/
│       └── theme.css                # Wi-Chain custom theme
├── scripts/                         # (Future) Deployment scripts
└── applets/                         # (Future) WASM smart contracts
```

## 🎨 Design System

### Color Palette
- **Primary**: Neon Green (`#00ff88`)
- **Background**: Dark Navy (`#0a0e1a`, `#0d1220`)
- **Borders**: Cyber Gray (`#1a2332`)
- **Text**: White & Gray variants

### Components
- Card-based layout with hover effects
- Glassmorphism accents
- Smooth transitions and animations
- Category-specific color coding for applets

## 💻 Development

### Prerequisites
- Node.js installed
- MetaMask extension installed in your browser

### Local Development Setup
This project consists of three parts that need to be running simultaneously. You will need **3 separate terminal windows**.

#### Step 1: Start Local Blockchain (Terminal 1)
1. Open a terminal in the root directory.
2. Run the following command to start Ganache:
   ```bash
   npx -y ganache --mnemonic "test test test test test test test test test test test junk" --port 8545 --chain.networkId 1337 --chain.chainId 1337
   ```
   *Note: Detailed accounts and keys will be listed once started.*

#### Step 2: Start Backend Server (Terminal 2)
1. Open a new terminal.
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

#### Step 3: Start Frontend Application (Terminal 3)
1. Open a new terminal in the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser and go to `http://localhost:5173`.

#### Step 4: MetaMask Setup
1. Open MetaMask and ensure you are connected to **Localhost 8545**.
   - **RPC URL**: `http://localhost:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
2. Import a test account using one of the Private Keys shown in Terminal 1 (Ganache).
3. **Important**: If you restart Ganache, always reset your MetaMask account via **Settings > Advanced > Clear activity tab data** to avoid nonce errors.

### Environment Variables

Create a `.env` file for production deployment:

```env
# WeilChain Network
VITE_WEILCHAIN_ENDPOINT=wss://node.weilchain.io
VITE_CONTRACT_REGISTRY=0x...

# Weil-SDK Configuration
VITE_WEIL_SDK_KEY=your_sdk_key
```

## 🔐 Wallet Integration

The app uses Weil-SDK for secure wallet connections:

1. User clicks "Connect Wallet"
2. KeyManager prompts for authentication
3. Wallet address (WNS name) is displayed
4. All transactions are signed locally

## 🎯 Applet Categories

- **AI**: Machine learning model training and inference
- **Audit**: Smart contract security analysis
- **Oracle**: Off-chain data feeds and price oracles
- **Storage**: Decentralized file storage (IPFS integration)
- **DeFi**: Yield farming and liquidity management
- **Compute**: Zero-knowledge proofs and private computation

## 📦 Deployment Workflow

### Frontend Deployment
```bash
# Build optimized production bundle
npm run build

# Deploy to hosting (Vercel, Netlify, etc.)
# Output directory: dist/
```

### WASM Applet Deployment

```bash
# Compile Rust to WASM
cd applets/my-applet
cargo build --target wasm32-unknown-unknown --release

# Deploy using WADK
wadk deploy \
  --endpoint wss://node.weilchain.io \
  --wasm target/wasm32-unknown-unknown/release/applet.wasm \
  --key ~/.weilchain/deployer.key

# Returns ContractHash for frontend integration
```

## 🔧 WASM Applet Structure

Example Rust applet with HTLC support:

```rust
#[no_mangle]
pub extern "C" fn invoke_service(data: *const u8, len: usize) -> i32 {
    // Service invocation logic
}

#[no_mangle]
pub extern "C" fn lock_funds(hash_lock: [u8; 32], timeout: u64) -> i32 {
    // HTLC lock implementation
}

#[no_mangle]
pub extern "C" fn claim_funds(preimage: &[u8]) -> i32 {
    // HTLC claim implementation
}
```

## 🌐 Network Configuration

Connect to different Wi-Chain pods:

- **Mainnet**: `wss://mainnet.weilchain.io`
- **Testnet**: `wss://testnet.weilchain.io`
- **Local Dev**: `ws://localhost:9944`

## 📊 Gas & Fees

- Each applet displays estimated gas cost
- Network fees (~5 WEIL) applied to all transactions
- Total cost shown before execution confirmation

## 🛡️ Security Considerations

⚠️ **Important**: This platform is designed for decentralized application interaction and is NOT intended for collecting Personally Identifiable Information (PII) or managing highly sensitive data.

- All transactions are on-chain and public
- Private keys never leave the user's device
- Use hardware wallets for production environments

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request with detailed description

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [WeilChain Documentation](https://docs.weilchain.io)
- [Weil-SDK](https://github.com/weilchain/weil-sdk)
- [WADK CLI](https://github.com/weilchain/wadk)

---

Built with ⚡ by the Wi-Chain community
