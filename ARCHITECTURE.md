# Wi-Chain DApp Architecture

## Overview

Wi-Chain Portal is a production-ready decentralized application that enables users to discover, authenticate, and execute cross-pod applets on the WeilChain network. The architecture follows a modern Web3 design pattern with a React frontend and WASM-based smart contracts.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           React Frontend (Wi-Chain Portal)             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │ │
│  │  │ Wallet   │  │ Applet   │  │   Transaction      │  │ │
│  │  │ Manager  │  │ Explorer │  │   Monitor          │  │ │
│  │  └────┬─────┘  └────┬─────┘  └──────┬─────────────┘  │ │
│  └───────┼─────────────┼────────────────┼────────────────┘ │
└──────────┼─────────────┼────────────────┼──────────────────┘
           │             │                │
           │             │                │ WebSocket/RPC
           ▼             ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    WeilChain Network                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  Pod #001  │  │  Pod #007  │  │   Pod #042         │    │
│  │            │  │            │  │                    │    │
│  │  ┌──────┐  │  │  ┌──────┐  │  │   ┌──────┐        │    │
│  │  │ WASM │  │  │  │ WASM │  │  │   │ WASM │        │    │
│  │  │Applet│  │  │  │Applet│  │  │   │Applet│        │    │
│  │  └──────┘  │  │  └──────┘  │  │   └──────┘        │    │
│  │            │  │            │  │                    │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Consensus Layer (Cross-Pod Sync)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Layer

#### 1. Application Shell
- **File**: `/src/app/App.tsx`
- **Responsibilities**:
  - Root component and state management
  - Route handling (tab-based navigation)
  - Wallet connection orchestration
  - Toast notification system

#### 2. UI Components

**Sidebar** (`/src/app/components/Sidebar.tsx`)
- Navigation menu
- Active tab highlighting
- Wi-Chain branding

**Header** (`/src/app/components/Header.tsx`)
- Global search functionality
- Wallet connection button
- User identity badge (WNS name display)

**AppletCard** (`/src/app/components/AppletCard.tsx`)
- Applet metadata display
- Category-based color coding
- Gas cost estimation
- Invoke CTA button

**RecentExecutions** (`/src/app/components/RecentExecutions.tsx`)
- Real-time transaction monitoring
- Status indicators (success/failed/pending)
- Fee information display

**WalletOverview** (`/src/app/components/WalletOverview.tsx`)
- WEIL token balance
- Current pod location
- Staked amount (if applicable)

**InvokeModal** (`/src/app/components/InvokeModal.tsx`)
- Dynamic form builder (based on applet ABI)
- Parameter input validation
- Transaction cost breakdown
- Execution confirmation

### Smart Contract Layer (WASM Applets)

#### Structure
```
applets/
├── example-applet/
│   ├── Cargo.toml           # Rust dependencies
│   ├── src/
│   │   └── lib.rs           # Main contract logic
│   └── target/
│       └── wasm32-unknown-unknown/
│           └── release/
│               └── example_applet.wasm
```

#### Core Functions

##### Entry Points (marked with `#[no_mangle]`)

1. **`invoke_service`**
   - Primary execution entry point
   - Handles arbitrary service invocations
   - Deserializes input parameters
   - Returns execution status code

2. **`lock_funds`** (HTLC)
   - Creates hashed time-locked contract
   - Parameters: hash_lock, timeout, receiver, amount
   - Enables atomic cross-pod swaps

3. **`claim_funds`** (HTLC)
   - Claims locked funds with preimage
   - Verifies hash matches
   - Transfers funds to receiver

4. **`claim_reward`**
   - Distributes rewards to eligible users
   - Checks eligibility criteria
   - Updates user balances

#### State Management

```rust
// Persistent storage interface
fn get_value(key: &[u8]) -> Option<Vec<u8>>;
fn set_value(key: &[u8], value: &[u8]) -> Result<(), Error>;

// In-memory caching
static mut STORAGE: HashMap<Vec<u8>, Vec<u8>>;
```

### Data Flow

#### 1. Applet Discovery Flow

```
User → Header Search → Filter Applets �� AppletCard Grid → Display Results
```

#### 2. Applet Invocation Flow

```
User Clicks "Invoke"
    ↓
Check Wallet Connection
    ↓
Open InvokeModal
    ↓
User Fills Parameters
    ↓
Display Gas Estimate
    ↓
User Confirms
    ↓
Sign Transaction (Weil-SDK)
    ↓
Submit to WeilChain
    ↓
Poll Transaction Status
    ↓
Update RecentExecutions
    ↓
Show Toast Notification
```

#### 3. HTLC Atomic Swap Flow

```
Alice (Pod #001)              Bob (Pod #007)
    ↓                             ↓
Generate Secret Preimage      Wait for Lock
    ↓                             ↓
Hash Secret (SHA256)          Monitor Events
    ↓                             ↓
lock_funds(hash, ...)         Receive Lock Event
    ↓                             ↓
Wait for Bob's Lock           lock_funds(hash, ...)
    ↓                             ↓
Monitor Bob's Lock            Reveal Preimage
    ↓                             ↓
claim_funds(preimage)         Extract Preimage
    ↓                             ↓
Funds Received               claim_funds(preimage)
                                  ↓
                              Funds Received
```

## Technology Stack

### Frontend
- **Framework**: React 18.3.1
- **Language**: TypeScript
- **Build Tool**: Vite 6.3.5
- **Styling**: Tailwind CSS 4.1.12
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State Management**: React Hooks (useState, useEffect)

### Backend (WASM)
- **Language**: Rust (edition 2021)
- **Target**: wasm32-unknown-unknown
- **Cryptography**: sha2, hex
- **Serialization**: serde, serde_json
- **Bindings**: wasm-bindgen

### Infrastructure
- **Network**: WeilChain (custom blockchain)
- **Consensus**: Cross-pod synchronization
- **Wallet SDK**: Weil-SDK (KeyManager)
- **Deployment**: WADK CLI

## Security Architecture

### Frontend Security
1. **Wallet Integration**
   - Private keys never leave user's device
   - All transactions signed locally
   - KeyManager provides secure key storage

2. **Input Validation**
   - Parameter sanitization in InvokeModal
   - Gas limit enforcement
   - Address format validation

3. **State Management**
   - No sensitive data in localStorage
   - Session-based wallet connection
   - Automatic disconnect on navigation

### Smart Contract Security
1. **HTLC Protection**
   - Timeout mechanism prevents fund locking
   - Hash verification ensures atomic swaps
   - Double-claim prevention

2. **Authorization**
   - Caller verification (in production)
   - Role-based access control
   - Pod-level permissions

3. **State Integrity**
   - Consensus-based state updates
   - Merkle proofs for verification
   - Rollback protection

## Deployment Architecture

### Frontend Deployment
```
Source Code → Vite Build → Static Assets → CDN/Hosting
                 ↓
           dist/ folder
                 ↓
           ┌────────────┐
           │  Vercel    │  (Recommended)
           │  Netlify   │  (Alternative)
           │  AWS S3    │  (Alternative)
           └────────────┘
```

### Applet Deployment
```
Rust Source → Cargo Build → WASM Binary → Optimize → Deploy
                                ↓
                        wasm32-unknown-unknown
                                ↓
                         ┌──────────────┐
                         │   wasm-opt   │
                         └──────────────┘
                                ↓
                         ┌──────────────┐
                         │  WADK CLI    │
                         └──────────────┘
                                ↓
                         WeilChain Network
                                ↓
                         Contract Hash
```

## API Integration

### WeilChain RPC Methods

```typescript
// Connect to network
weilchain.connect(endpoint: string): Promise<void>

// Query applet registry
weilchain.queryRegistry(filter: AppletFilter): Promise<Applet[]>

// Invoke applet
weilchain.invokeApplet(
  contractHash: string,
  method: string,
  params: Record<string, any>,
  gasLimit: number
): Promise<TransactionHash>

// Monitor transaction
weilchain.getTransaction(txHash: string): Promise<TransactionStatus>

// Subscribe to events
weilchain.subscribeEvents(
  filter: EventFilter,
  callback: (event: Event) => void
): Subscription
```

## Performance Optimizations

### Frontend
- Code splitting by route
- Lazy loading of components
- Image optimization with figma:asset
- Tailwind CSS purging for minimal bundle size
- React.memo for expensive components

### WASM
- Aggressive optimization flags (`opt-level = "z"`)
- Link-time optimization (LTO)
- Symbol stripping
- wasm-opt post-processing
- Minimal dependencies

## Scalability Considerations

### Horizontal Scaling
- Multi-pod architecture
- Cross-pod state synchronization
- Load balancing across pods

### Caching Strategy
- Frontend: Service Worker for static assets
- Backend: In-memory state cache
- Network: CDN for global distribution

## Monitoring & Observability

### Frontend Metrics
- Wallet connection success rate
- Transaction submission latency
- User engagement (applet invocations)
- Error rates by component

### Smart Contract Metrics
- Gas usage per invocation
- Execution time
- State storage growth
- HTLC success/failure rates

## Future Enhancements

1. **Advanced Features**
   - Multi-signature support
   - Scheduled executions
   - Applet composition (chaining)
   - On-chain governance

2. **Developer Tools**
   - Applet debugger
   - Gas profiler
   - ABI generator
   - Testing framework

3. **User Experience**
   - Mobile app (React Native)
   - Hardware wallet support
   - Fiat on-ramp integration
   - Social recovery

---

**Last Updated**: January 3, 2026
**Version**: 1.0.0
