# WeilChain Portal Dashboard - Start Instructions

This project consists of three parts that need to be running simultaneously:
1. Local Blockchain (Ganache)
2. Backend Server
3. Frontend Application

You will need 3 separate terminal windows.

## Prerequisites
- Node.js installed
- MetaMask extension installed in your browser

---

## Step 1: Start Local Blockchain (Terminal 1)
This simulates an Ethereum blockchain on your local machine.

1. Open a terminal in the root directory: `d:\WeilChain Portal Dashboard Design`
2. Run the following command:
   ```bash
   npx -y ganache --mnemonic "test test test test test test test test test test test junk" --port 8545 --chain.networkId 1337 --chain.chainId 1337
   ```
   
   *Note: detailed accounts and keys will be listed once started.*

---

## Step 2: Start Backend Server (Terminal 2)
This handles the API and database.

1. Open a new terminal.
2. Navigate to the server directory:
   ```bash
   cd server
   ```
3. Install dependencies (if first time):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

---

## Step 3: Start Frontend Application (Terminal 3)
This runs the React dashboard.

1. Open a new terminal in the root directory: `d:\WeilChain Portal Dashboard Design`
2. Install dependencies (if first time):
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
4. Open your browser and go to the link shown (usually http://localhost:5173).

---

## Step 4: MetaMask Setup
1. Open MetaMask and ensure you are connected to **Localhost 8545**.
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
2. Import a test account using one of the Private Keys shown in Terminal 1 (Ganache).
3. If you restart Ganache (Step 1), always reset your MetaMask account:
   - Go to **Settings > Advanced > Clear activity tab data**.
