# Wi-Chain Portal - Quick Start Guide

Get up and running with Wi-Chain Portal in **5 minutes**! ⚡

## 🚀 Fastest Start (Frontend Only)

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser
# Navigate to http://localhost:5173
```

**That's it!** You now have a fully functional Wi-Chain DApp running locally. 🎉

## 🎮 Try These Features

### 1. Connect Your Wallet
- Click the **"Connect Wallet"** button in the header
- See your mock wallet address: `user.weil`
- Balance: 1245 WEIL

### 2. Browse Applets
- Explore 8 pre-configured applets
- Filter by category (AI, Audit, Oracle, Storage, DeFi, Compute)
- View gas costs and descriptions

### 3. Invoke an Applet
- Click **"Invoke"** on any applet card
- Fill in parameters in the modal
- See transaction cost breakdown
- Click **"Execute"** to simulate deployment

### 4. Monitor Transactions
- Check **Recent Executions** panel on the right
- See real-time status updates (Success ✅, Failed ❌, Pending ⏳)

### 5. Explore Navigation
- **Discover Applets**: Main marketplace
- **My Portfolio**: Your deployed contracts (coming soon)
- **Execution History**: Full transaction history
- **Settings**: Network configuration (coming soon)

## 🔧 Building WASM Applets (Optional)

Want to deploy actual smart contracts? Follow these steps:

### Prerequisites
```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add WASM target
rustup target add wasm32-unknown-unknown
```

### Build Example Applet
```bash
# Using Makefile (recommended)
make build-applet APPLET_NAME=example-applet

# Or manually
cd applets/example-applet
cargo build --target wasm32-unknown-unknown --release
```

### Deploy to Testnet
```bash
make deploy-applet APPLET_NAME=example-applet NETWORK=testnet
```

## 📁 Project Structure (5-Minute Tour)

```
wi-chain-portal/
├── src/app/
│   ├── App.tsx              ← Main app (start here!)
│   ├── components/          ← UI components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── AppletCard.tsx
│   │   └── ...
│   └── data/
│       └── mockData.ts      ← Edit to add more applets
│
├── applets/                 ← WASM smart contracts
│   └── example-applet/
│       └── src/lib.rs       ← Contract logic
│
└── scripts/
    └── deploy.js            ← Deployment automation
```

## 🎨 Customize Your Experience

### Add a New Applet (Frontend)

Edit `/src/app/data/mockData.ts`:

```typescript
export const mockApplets = [
  // ... existing applets
  {
    id: '9',
    name: 'Your Custom Applet',
    provider: 'Your Name',
    category: 'AI', // or 'Audit', 'Oracle', etc.
    description: 'What your applet does',
    gasCost: 300,
    icon: 'brain',
  },
];
```

### Change Theme Colors

Edit `/src/styles/theme.css`:

```css
.dark {
  --primary: #00ff88;        /* Neon Green (change this!) */
  --background: #0a0e1a;     /* Dark Navy */
  --card: #0d1220;           /* Card Background */
  --border: #1a2332;         /* Borders */
}
```

### Modify Applet Categories

Edit `/src/app/components/CategoryFilter.tsx` to add/remove categories.

## 🧪 Testing Your Changes

```bash
# Frontend development server (auto-reload)
npm run dev

# Build production bundle
npm run build

# Test WASM applet
cd applets/example-applet
cargo test
```

## 🌐 Deploy to Production

### Frontend (Vercel - Free)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts and your site is live! 🚀
```

### Frontend (Netlify - Free)

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --dir=dist --prod
```

## 📚 Next Steps

Choose your learning path:

### For Frontend Developers
1. ✅ Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)
2. 🎨 Customize UI components
3. 📱 Add mobile responsiveness
4. 🧪 Write component tests

### For Smart Contract Developers
1. 🦀 Read [API_REFERENCE.md](./API_REFERENCE.md)
2. 🔧 Build custom WASM applets
3. 🔐 Implement HTLC contracts
4. 🚀 Deploy to testnet

### For System Architects
1. 📖 Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. 🔍 Explore project structure
3. 🔌 Integrate real Weil-SDK
4. 📊 Add analytics

## 🆘 Common Issues

### Port Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### WASM Build Fails
```bash
# Verify Rust installation
rustc --version

# Reinstall WASM target
rustup target remove wasm32-unknown-unknown
rustup target add wasm32-unknown-unknown
```

## 💬 Get Help

- 📖 **Documentation**: See [README.md](./README.md)
- 💬 **Discord**: https://discord.gg/weilchain
- 🐛 **Issues**: https://github.com/weilchain/portal/issues
- 📧 **Email**: support@weilchain.io

## 🎉 You're Ready!

Congratulations! You now have:
- ✅ A running Wi-Chain DApp
- ✅ Understanding of core features
- ✅ Knowledge of project structure
- ✅ Resources for next steps

**Happy building!** 🚀

---

**Time to First Run**: < 5 minutes ⚡  
**Difficulty**: Beginner-friendly 🟢  
**Next**: [Full Setup Guide](./SETUP_GUIDE.md) →
