# Wi-Chain DApp Setup Guide

Complete guide for setting up and running the Wi-Chain Portal locally and deploying to production.

## 📋 Prerequisites

### Required Software
- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Rust**: Latest stable version ([Install](https://rustup.rs/))
- **wasm32 target**: For WASM compilation

### Optional Tools
- **wasm-opt**: Binary optimizer from binaryen toolkit
  ```bash
  # macOS
  brew install binaryen
  
  # Ubuntu/Debian
  apt-get install binaryen
  
  # Windows
  choco install binaryen
  ```

- **cargo-watch**: For development hot-reload
  ```bash
  cargo install cargo-watch
  ```

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/wichain-portal.git
cd wichain-portal
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Rust WASM Target
```bash
rustup target add wasm32-unknown-unknown
```

### 4. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🛠️ Development Workflow

### Frontend Development

#### Running the Development Server
```bash
npm run dev
```
- Hot module replacement enabled
- Opens at `http://localhost:5173`
- Changes reflect immediately

#### Building for Production
```bash
npm run build
```
- Output directory: `dist/`
- Optimized and minified
- Ready for deployment

#### Project Structure
```
src/
├── app/
│   ├── components/         # React components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── AppletCard.tsx
│   │   ├── RecentExecutions.tsx
│   │   ├── WalletOverview.tsx
│   │   └── InvokeModal.tsx
│   ├── data/
│   │   └── mockData.ts     # Mock applet data
│   └── App.tsx             # Main app component
└── styles/
    └── theme.css           # Wi-Chain theme (dark mode)
```

### WASM Applet Development

#### Creating a New Applet
```bash
# Using the Makefile
make new-applet

# Or manually
cargo new applets/my-applet --lib
cd applets/my-applet
```

#### Edit Cargo.toml
```toml
[package]
name = "my-applet"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
wasm-bindgen = "0.2"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
sha2 = "0.10"
hex = "0.4"

[profile.release]
opt-level = "z"
lto = true
codegen-units = 1
panic = "abort"
strip = true
```

#### Implement Entry Points
```rust
// src/lib.rs

#[no_mangle]
pub extern "C" fn invoke_service(data: *const u8, len: usize) -> i32 {
    // Your service logic here
    0 // Return success
}

#[no_mangle]
pub extern "C" fn my_custom_function(param: u64) -> i32 {
    // Custom function implementation
    0
}
```

#### Build the Applet
```bash
# Using Makefile
make build-applet APPLET_NAME=my-applet

# Or manually
cd applets/my-applet
cargo build --target wasm32-unknown-unknown --release
```

#### Test the Applet
```bash
# Using Makefile
make test-applet APPLET_NAME=my-applet

# Or manually
cd applets/my-applet
cargo test
```

#### Optimize WASM Binary
```bash
# Using Makefile
make optimize-applet APPLET_NAME=my-applet

# Or manually
wasm-opt -Oz -o applet.wasm.opt applet.wasm
mv applet.wasm.opt applet.wasm
```

## 🌐 Network Configuration

### Connecting to Different Networks

Create a `.env` file in the project root:

```env
# Testnet (Default)
VITE_WEILCHAIN_ENDPOINT=wss://testnet.weilchain.io
VITE_CHAIN_ID=weil-testnet-1

# Mainnet
# VITE_WEILCHAIN_ENDPOINT=wss://mainnet.weilchain.io
# VITE_CHAIN_ID=weil-mainnet-1

# Local Development
# VITE_WEILCHAIN_ENDPOINT=ws://localhost:9944
# VITE_CHAIN_ID=weil-local-dev
```

### Network Endpoints
- **Mainnet**: `wss://mainnet.weilchain.io`
- **Testnet**: `wss://testnet.weilchain.io`
- **Local**: `ws://localhost:9944` (requires local node)

## 🔑 Wallet Setup

### Using the Mock Wallet (Development)
1. Click "Connect Wallet" in the UI
2. Mock wallet auto-connects with address `user.weil`
3. Balance: 1245 WEIL (simulated)

### Using Real Wallet (Production)

#### Install Weil-SDK
```bash
npm install @weilchain/sdk
```

#### Update Header Component
```typescript
import { WeilSDK } from '@weilchain/sdk';

const sdk = new WeilSDK({
  endpoint: import.meta.env.VITE_WEILCHAIN_ENDPOINT
});

const handleConnect = async () => {
  const wallet = await sdk.connectWallet();
  setWalletAddress(wallet.address);
};
```

## 📦 Deployment

### Frontend Deployment

#### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

#### Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Production deployment
netlify deploy --prod
```

#### Environment Variables (Production)
Set these in your hosting dashboard:
- `VITE_WEILCHAIN_ENDPOINT`
- `VITE_CHAIN_ID`
- `VITE_CONTRACT_REGISTRY` (applet registry contract)

### WASM Applet Deployment

#### Deploy to Testnet
```bash
# Using Makefile
make deploy-applet APPLET_NAME=my-applet NETWORK=testnet

# Or using script directly
node scripts/deploy.js --applet my-applet --network testnet
```

#### Deploy to Mainnet
```bash
# Generate deployment key (one-time)
wadk keygen --output ~/.weilchain/deployer.key

# Fund the deployment account
# Transfer WEIL to the address shown by keygen

# Deploy
make deploy-applet APPLET_NAME=my-applet NETWORK=mainnet
```

#### Verify Deployment
```bash
# Query contract on-chain
wadk query \
  --endpoint wss://testnet.weilchain.io \
  --contract <CONTRACT_HASH>
```

## 🧪 Testing

### Frontend Testing
```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/react

# Run tests (when configured)
npm test
```

### WASM Testing
```bash
# Run unit tests
cd applets/my-applet
cargo test

# Run with output
cargo test -- --nocapture

# Test specific function
cargo test test_htlc_flow
```

### Integration Testing
```bash
# Start local WeilChain node
weilchain-node --dev

# Deploy applet to local network
make deploy-applet APPLET_NAME=my-applet NETWORK=local

# Test via frontend
npm run dev
```

## 🐛 Troubleshooting

### Common Issues

#### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
```

#### WASM build fails
```bash
# Verify Rust installation
rustc --version

# Check wasm32 target
rustup target list | grep wasm32

# Reinstall target
rustup target add wasm32-unknown-unknown
```

#### Wallet connection fails
- Check network endpoint is accessible
- Verify CORS settings on backend
- Check browser console for errors
- Ensure HTTPS in production (WebSocket Secure)

#### Deployment script fails
```bash
# Check Node.js version
node --version  # Should be >= 18

# Verify deployment key exists
ls ~/.weilchain/deployer.key

# Check network connectivity
ping testnet.weilchain.io
```

## 📚 Additional Resources

### Documentation
- [WeilChain Docs](https://docs.weilchain.io)
- [Weil-SDK API Reference](https://sdk.weilchain.io)
- [WADK CLI Guide](https://github.com/weilchain/wadk)

### Example Applets
- Simple Storage: `applets/example-applet/`
- Oracle Service: `applets/oracle-example/` (future)
- HTLC Demo: `applets/htlc-demo/` (future)

### Community
- [Discord](https://discord.gg/weilchain)
- [GitHub Discussions](https://github.com/weilchain/portal/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/weilchain)

## 🔄 Update Guide

### Updating Dependencies
```bash
# Check for updates
npm outdated

# Update frontend dependencies
npm update

# Update Rust dependencies
cd applets/my-applet
cargo update
```

### Migrating Applets
When updating to new WeilChain versions:
1. Review breaking changes in release notes
2. Update Cargo dependencies
3. Rebuild and test locally
4. Deploy to testnet first
5. Verify functionality
6. Deploy to mainnet

## 💡 Best Practices

### Development
1. Use TypeScript for type safety
2. Write tests for critical functions
3. Keep components small and focused
4. Use environment variables for config
5. Never commit private keys

### WASM Development
1. Minimize binary size (optimize for `z`)
2. Use efficient algorithms
3. Test edge cases thoroughly
4. Document entry points
5. Version your contracts

### Security
1. Validate all inputs
2. Use secure randomness
3. Implement access controls
4. Audit before mainnet deployment
5. Have an upgrade strategy

## 🎓 Learning Path

1. **Week 1**: Setup environment, run locally
2. **Week 2**: Modify UI components, customize theme
3. **Week 3**: Create simple WASM applet
4. **Week 4**: Deploy to testnet, integrate with frontend
5. **Week 5**: Add advanced features (HTLC, events)
6. **Week 6**: Production deployment

---

Need help? Join our [Discord community](https://discord.gg/weilchain) or check the [FAQ](https://docs.weilchain.io/faq).
