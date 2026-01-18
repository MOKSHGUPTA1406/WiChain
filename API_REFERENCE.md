# Wi-Chain Portal API Reference

Complete API documentation for interacting with Wi-Chain applets and the frontend components.

## Table of Contents

1. [Frontend Components API](#frontend-components-api)
2. [WASM Applet Entry Points](#wasm-applet-entry-points)
3. [WeilChain RPC Methods](#weilchain-rpc-methods)
4. [Data Types](#data-types)
5. [Error Codes](#error-codes)

---

## Frontend Components API

### AppletCard Component

Display an applet with metadata and invoke action.

```typescript
interface AppletCardProps {
  applet: Applet;
  onInvoke: (appletId: string) => void;
}

interface Applet {
  id: string;
  name: string;
  provider: string;
  category: 'AI' | 'Audit' | 'Oracle' | 'Storage' | 'DeFi' | 'Compute';
  description: string;
  gasCost: number;
  icon: string;
}
```

**Usage:**
```tsx
<AppletCard
  applet={{
    id: '1',
    name: 'AI Model Training',
    provider: 'Neural Networks Inc.',
    category: 'AI',
    description: 'Distributed AI training',
    gasCost: 250,
    icon: 'brain'
  }}
  onInvoke={(id) => console.log(`Invoking ${id}`)}
/>
```

### InvokeModal Component

Modal for executing applets with dynamic parameters.

```typescript
interface InvokeModalProps {
  applet: Applet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (appletId: string, params: Record<string, string>) => void;
}
```

**Usage:**
```tsx
<InvokeModal
  applet={selectedApplet}
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onConfirm={(id, params) => {
    console.log(`Executing ${id} with params:`, params);
  }}
/>
```

### RecentExecutions Component

Display transaction history with status indicators.

```typescript
interface RecentExecutionsProps {
  executions: Execution[];
}

interface Execution {
  id: number;
  name: string;
  status: 'success' | 'failed' | 'pending';
  fee?: number;
  timestamp: string;
}
```

**Usage:**
```tsx
<RecentExecutions
  executions={[
    {
      id: 1,
      name: 'AI Model Training',
      status: 'success',
      fee: 210,
      timestamp: '2m ago'
    }
  ]}
/>
```

### WalletOverview Component

Display wallet balance and pod information.

```typescript
interface WalletOverviewProps {
  balance: number;    // WEIL tokens
  pod: string;        // Pod identifier (e.g., "#007")
  stake?: number;     // Optional staked amount
}
```

**Usage:**
```tsx
<WalletOverview
  balance={1245}
  pod="#007"
  stake={350}
/>
```

---

## WASM Applet Entry Points

### invoke_service

Primary entry point for applet execution.

```rust
#[no_mangle]
pub extern "C" fn invoke_service(
    data: *const u8,
    len: usize
) -> i32
```

**Parameters:**
- `data`: Pointer to serialized input data
- `len`: Length of input data in bytes

**Returns:**
- `0`: Success
- `-1`: Generic error
- `-2`: Invalid input
- `-3`: Unauthorized

**Example:**
```rust
#[no_mangle]
pub extern "C" fn invoke_service(data: *const u8, len: usize) -> i32 {
    let input = unsafe { std::slice::from_raw_parts(data, len) };
    
    // Parse input
    let request: ServiceRequest = serde_json::from_slice(input).unwrap();
    
    // Execute service logic
    process_request(request);
    
    0 // Success
}
```

### lock_funds (HTLC)

Create a hashed time-locked contract for atomic swaps.

```rust
#[no_mangle]
pub extern "C" fn lock_funds(
    hash_lock_ptr: *const u8,
    timeout: u64,
    receiver_ptr: *const u8,
    receiver_len: usize,
    amount: u64
) -> i32
```

**Parameters:**
- `hash_lock_ptr`: Pointer to 32-byte hash (SHA256)
- `timeout`: Block height when lock expires
- `receiver_ptr`: Pointer to receiver address
- `receiver_len`: Length of receiver address
- `amount`: Amount of WEIL tokens to lock

**Returns:**
- `0`: Lock created successfully
- `-1`: Insufficient balance
- `-2`: Invalid parameters
- `-3`: Timeout already passed

**Example:**
```rust
use sha2::{Sha256, Digest};

// Generate hash lock
let preimage = b"my_secret_123";
let hash_lock = Sha256::digest(preimage);

// Lock funds
let result = lock_funds(
    hash_lock.as_ptr(),
    current_block + 1000,
    b"receiver_address".as_ptr(),
    16,
    100
);
```

### claim_funds (HTLC)

Claim locked funds by revealing the preimage.

```rust
#[no_mangle]
pub extern "C" fn claim_funds(
    preimage_ptr: *const u8,
    preimage_len: usize
) -> i32
```

**Parameters:**
- `preimage_ptr`: Pointer to preimage data
- `preimage_len`: Length of preimage

**Returns:**
- `0`: Funds claimed successfully
- `-1`: HTLC not found
- `-2`: Invalid preimage (hash mismatch)
- `-3`: HTLC expired
- `-4`: Already claimed

**Example:**
```rust
let preimage = b"my_secret_123";

let result = claim_funds(
    preimage.as_ptr(),
    preimage.len()
);

if result == 0 {
    println!("Funds claimed!");
}
```

### claim_reward

Distribute rewards to eligible users.

```rust
#[no_mangle]
pub extern "C" fn claim_reward(
    user_ptr: *const u8,
    user_len: usize
) -> i32
```

**Parameters:**
- `user_ptr`: Pointer to user address
- `user_len`: Length of user address

**Returns:**
- `0`: Reward claimed
- `-1`: User not eligible
- `-2`: No rewards available
- `-3`: Already claimed

### get_value

Query stored value from contract state.

```rust
#[no_mangle]
pub extern "C" fn get_value(
    key_ptr: *const u8,
    key_len: usize
) -> i32
```

**Parameters:**
- `key_ptr`: Pointer to key bytes
- `key_len`: Length of key

**Returns:**
- `>= 0`: Length of value (success)
- `-1`: Key not found

### set_value

Store a value in contract state.

```rust
#[no_mangle]
pub extern "C" fn set_value(
    key_ptr: *const u8,
    key_len: usize,
    value_ptr: *const u8,
    value_len: usize
) -> i32
```

**Parameters:**
- `key_ptr`: Pointer to key bytes
- `key_len`: Length of key
- `value_ptr`: Pointer to value bytes
- `value_len`: Length of value

**Returns:**
- `0`: Success
- `-1`: Storage error
- `-2`: Insufficient permissions

---

## WeilChain RPC Methods

### Connect to Network

```javascript
weilchain.connect(endpoint)
```

**Parameters:**
- `endpoint` (string): WebSocket endpoint URL

**Returns:**
- `Promise<void>`

**Example:**
```javascript
await weilchain.connect('wss://testnet.weilchain.io');
```

### Query Applet Registry

```javascript
weilchain.queryRegistry(filter)
```

**Parameters:**
- `filter` (object):
  - `category?: string` - Filter by category
  - `provider?: string` - Filter by provider
  - `minGas?: number` - Minimum gas cost
  - `maxGas?: number` - Maximum gas cost

**Returns:**
- `Promise<Applet[]>`

**Example:**
```javascript
const aiApplets = await weilchain.queryRegistry({
  category: 'AI',
  maxGas: 500
});
```

### Invoke Applet

```javascript
weilchain.invokeApplet(contractHash, method, params, gasLimit)
```

**Parameters:**
- `contractHash` (string): Contract address
- `method` (string): Function name to call
- `params` (object): Method parameters
- `gasLimit` (number): Maximum gas units

**Returns:**
- `Promise<string>` - Transaction hash

**Example:**
```javascript
const txHash = await weilchain.invokeApplet(
  '0x1a2b3c...',
  'invoke_service',
  { dataset_hash: '0xabcd...', epochs: 100 },
  5000
);
```

### Get Transaction Status

```javascript
weilchain.getTransaction(txHash)
```

**Parameters:**
- `txHash` (string): Transaction hash

**Returns:**
- `Promise<TransactionStatus>`

**Example:**
```javascript
const status = await weilchain.getTransaction('0xdef456...');
console.log(status.status); // 'pending' | 'success' | 'failed'
```

### Subscribe to Events

```javascript
weilchain.subscribeEvents(filter, callback)
```

**Parameters:**
- `filter` (object):
  - `contractHash?: string`
  - `eventType?: string`
- `callback` (function): `(event: Event) => void`

**Returns:**
- `Subscription` object with `unsubscribe()` method

**Example:**
```javascript
const subscription = weilchain.subscribeEvents(
  { contractHash: '0x1a2b3c...', eventType: 'FundsLocked' },
  (event) => {
    console.log('HTLC created:', event.data);
  }
);

// Later...
subscription.unsubscribe();
```

---

## Data Types

### Applet

```typescript
interface Applet {
  id: string;
  name: string;
  provider: string;
  category: AppletCategory;
  description: string;
  gasCost: number;
  icon: string;
  contractHash?: string;
  abi?: AppletABI;
}

type AppletCategory = 
  | 'AI' 
  | 'Audit' 
  | 'Oracle' 
  | 'Storage' 
  | 'DeFi' 
  | 'Compute';
```

### TransactionStatus

```typescript
interface TransactionStatus {
  hash: string;
  status: 'pending' | 'success' | 'failed';
  blockNumber?: number;
  gasUsed?: number;
  events?: Event[];
  error?: string;
}
```

### Event

```typescript
interface Event {
  type: string;
  contractHash: string;
  blockNumber: number;
  timestamp: number;
  data: Record<string, any>;
}
```

### AppletABI

```typescript
interface AppletABI {
  name: string;
  version: string;
  functions: FunctionDefinition[];
}

interface FunctionDefinition {
  name: string;
  inputs: Parameter[];
  outputs: Parameter[];
  mutability: 'view' | 'pure' | 'payable';
}

interface Parameter {
  name: string;
  type: 'u8' | 'u16' | 'u32' | 'u64' | 'string' | 'bytes' | 'address';
  description?: string;
}
```

### HTLC

```typescript
interface HTLC {
  sender: string;
  receiver: string;
  amount: number;
  hashLock: string;  // 32-byte hex string
  timeout: number;   // Block height
  claimed: boolean;
}
```

---

## Error Codes

### Frontend Errors

| Code | Message | Description |
|------|---------|-------------|
| `WALLET_NOT_CONNECTED` | Wallet not connected | User must connect wallet first |
| `INSUFFICIENT_BALANCE` | Insufficient WEIL balance | Not enough tokens for transaction |
| `INVALID_PARAMETERS` | Invalid applet parameters | Parameter validation failed |
| `NETWORK_ERROR` | Network connection error | Unable to reach WeilChain network |
| `TX_REJECTED` | Transaction rejected | User rejected transaction signing |

### WASM Errors

| Code | Name | Description |
|------|------|-------------|
| `0` | `SUCCESS` | Operation completed successfully |
| `-1` | `GENERIC_ERROR` | Unspecified error occurred |
| `-2` | `INVALID_INPUT` | Input parameters are invalid |
| `-3` | `UNAUTHORIZED` | Caller lacks required permissions |
| `-4` | `NOT_FOUND` | Requested resource not found |
| `-5` | `ALREADY_EXISTS` | Resource already exists |
| `-6` | `STORAGE_ERROR` | State storage operation failed |
| `-7` | `TIMEOUT` | Operation timed out |
| `-8` | `INSUFFICIENT_FUNDS` | Not enough tokens |

### RPC Errors

| Code | Message | Description |
|------|---------|-------------|
| `1000` | Invalid endpoint | WebSocket endpoint unreachable |
| `1001` | Connection timeout | Failed to establish connection |
| `1002` | Authentication failed | Invalid credentials |
| `2000` | Contract not found | Contract hash does not exist |
| `2001` | Invalid method | Method not found in contract |
| `3000` | Gas limit exceeded | Transaction ran out of gas |
| `3001` | Execution reverted | Contract execution failed |

---

## Code Examples

### Complete HTLC Flow

```typescript
// Frontend
import { weilchain } from '@weilchain/sdk';
import { sha256 } from 'crypto-hash';

// 1. Generate secret and hash
const secret = 'my_secret_preimage_123';
const hashLock = await sha256(secret);

// 2. Alice locks funds on Pod #001
const aliceTx = await weilchain.invokeApplet(
  '0xcontract_on_pod_001',
  'lock_funds',
  {
    hashLock,
    timeout: currentBlock + 1000,
    receiver: 'bob.weil',
    amount: 100
  },
  5000
);

// 3. Bob locks funds on Pod #007
const bobTx = await weilchain.invokeApplet(
  '0xcontract_on_pod_007',
  'lock_funds',
  {
    hashLock,
    timeout: currentBlock + 1000,
    receiver: 'alice.weil',
    amount: 200
  },
  5000
);

// 4. Alice reveals secret and claims Bob's funds
const aliceClaimTx = await weilchain.invokeApplet(
  '0xcontract_on_pod_007',
  'claim_funds',
  { preimage: secret },
  3000
);

// 5. Bob extracts secret from event and claims Alice's funds
const events = await weilchain.getTransaction(aliceClaimTx);
const revealedSecret = events.events[0].data.preimage;

const bobClaimTx = await weilchain.invokeApplet(
  '0xcontract_on_pod_001',
  'claim_funds',
  { preimage: revealedSecret },
  3000
);

console.log('Atomic swap complete! ✅');
```

### Custom Applet with State

```rust
// WASM Applet
use std::collections::HashMap;

static mut COUNTER: u64 = 0;
static mut USER_SCORES: Option<HashMap<String, u64>> = None;

#[no_mangle]
pub extern "C" fn increment_counter() -> i32 {
    unsafe {
        COUNTER += 1;
        COUNTER as i32
    }
}

#[no_mangle]
pub extern "C" fn get_counter() -> i32 {
    unsafe { COUNTER as i32 }
}

#[no_mangle]
pub extern "C" fn set_score(
    user_ptr: *const u8,
    user_len: usize,
    score: u64
) -> i32 {
    let user = unsafe {
        std::str::from_utf8(
            std::slice::from_raw_parts(user_ptr, user_len)
        ).unwrap()
    };
    
    unsafe {
        if USER_SCORES.is_none() {
            USER_SCORES = Some(HashMap::new());
        }
        USER_SCORES.as_mut().unwrap().insert(user.to_string(), score);
    }
    
    0
}
```

---

## Versioning

API version: `v1.0.0`

All breaking changes will increment the major version number. Subscribe to the [changelog](https://docs.weilchain.io/changelog) for updates.

---

**Need help?** Check the [Setup Guide](./SETUP_GUIDE.md) or join our [Discord](https://discord.gg/weilchain).
