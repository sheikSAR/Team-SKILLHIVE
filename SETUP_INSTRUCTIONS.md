# EDUBLOCKS - Windows Installation Guide

## 🎯 Overview

This guide provides comprehensive instructions for setting up the Edublocks blockchain-based educational platform on Windows 10/11.

**Project Structure:**
- `client/` - React frontend
- `server/` - Node.js backend
- `contracts/` - Solidity smart contracts
- `migrations/` - Truffle migrations

**Technology Stack:**
- Node.js + npm
- React.js
- Express.js
- Truffle Suite
- Ganache (local blockchain)
- Web3.js
- MetaMask

---

## 📋 System Requirements

### Minimum Requirements
- **OS:** Windows 10 or Windows 11
- **RAM:** 4GB (8GB recommended)
- **Disk Space:** 2GB free
- **Internet:** Required for initial setup

### Required Software
- Node.js 14.x or higher (LTS recommended)
- npm 6.x or higher
- Git for Windows (recommended)
- MetaMask browser extension

### Optional but Recommended
- Visual Studio Code (editor)
- Postman (API testing)
- Ganache GUI (blockchain management)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Clone or Download Project
```bash
# If using Git
git clone <repository-url>
cd edublocks-app

# Or extract the ZIP file and navigate to the directory
```

### Step 2: Run Setup Script
```bash
# Double-click: setup-windows.bat
# OR run from command prompt:
setup-windows.bat
```

This script will:
✅ Check all prerequisites
✅ Install Node.js dependencies
✅ Set up the project structure
✅ Install Truffle tools

### Step 3: Start Ganache
Open Ganache GUI or run in command prompt:
```bash
ganache-cli --host 127.0.0.1 --port 7545
```

### Step 4: Deploy Smart Contracts
```bash
# Double-click: deploy-contracts.bat
# OR run:
deploy-contracts.bat
```

### Step 5: Start Development Servers
```bash
# Double-click: run-dev.bat
# OR run:
npm run dev
```

**Access the Application:**
- **Client:** http://localhost:3000
- **Server:** http://localhost:4000
- **Ganache:** http://127.0.0.1:7545

---

## 📦 Detailed Installation Instructions

### 1. Install Node.js and npm

**Download:**
Visit https://nodejs.org/ and download the LTS version (16.x or higher)

**Install:**
- Run the installer
- Accept the default options
- Check "Add to PATH"
- Restart your computer

**Verify Installation:**
```bash
node --version    # Should show v16.x.x or higher
npm --version     # Should show 7.x.x or higher
```

### 2. Download Project Files

**Option A: Using Git**
```bash
git clone <repository-url>
cd edublocks-app
```

**Option B: Manual Download**
1. Download the ZIP file
2. Extract to your desired location
3. Open command prompt in that directory

### 3. Run Automated Setup

In the project root directory, run:
```bash
setup-windows.bat
```

**What This Does:**
- Verifies Node.js and npm installation
- Checks for Ganache (optional warning if not found)
- Creates necessary directories
- Installs root project dependencies
- Installs client dependencies
- Installs server dependencies
- Installs Truffle globally

**Expected Output:**
```
[SUCCESS] All prerequisites checked!
[OK] All required directories found!
[OK] Root dependencies installed!
[OK] Client dependencies installed!
[OK] Server dependencies installed!
[OK] Truffle installed!
```

---

## 🔗 Blockchain Setup

### 1. Install Ganache

**Option A: Ganache GUI (Recommended)**
- Download from: https://www.trufflesuite.com/ganache
- Install and run the application
- Create/open a workspace
- Note the port (default: 7545)

**Option B: Ganache CLI**
```bash
npm install -g ganache-cli
ganache-cli --host 127.0.0.1 --port 7545
```

### 2. Deploy Smart Contracts

Ensure Ganache is running, then:
```bash
deploy-contracts.bat
```

This will:
1. Verify Ganache is accessible
2. Compile smart contracts
3. Run migrations
4. Deploy to local blockchain

**Expected Output:**
```
Running migrations...

1_initial_migration.js
=======================
2_deploy_edublocks.js
=======================
3_deploy_token.js
=======================
4_deploy_tokensale.js
=======================

[SUCCESS] Smart contracts deployed successfully!
```

---

## 🎨 Frontend & Backend Setup

### 1. Install MetaMask Browser Extension

1. Go to https://metamask.io
2. Install for your browser (Chrome, Firefox, Edge)
3. Create a wallet or import existing
4. Add Local Network:
   - Network Name: `Ganache`
   - RPC URL: `http://127.0.0.1:7545`
   - Chain ID: `5777`
   - Currency: `ETH`

### 2. Start Development Servers

```bash
run-dev.bat
```

This opens two command windows:
- **Window 1:** React Client (http://localhost:3000)
- **Window 2:** Node Server (http://localhost:4000)

Wait 30-60 seconds for servers to initialize.

### 3. Access the Application

1. Open browser
2. Go to http://localhost:3000
3. Click "Signup" or "Login"
4. Connect MetaMask wallet
5. Complete registration

---

## ⚙️ Manual Setup (If Scripts Fail)

### Install Dependencies Manually

```bash
# Root dependencies
npm install

# Client dependencies
cd client
npm install
cd ..

# Server dependencies
cd server
npm install
cd ..
```

### Deploy Contracts Manually

```bash
# Compile contracts
truffle compile

# Run migrations
truffle migrate --network development
```

### Start Servers Manually

**Terminal 1 - Client:**
```bash
cd client
npm start
```

**Terminal 2 - Server:**
```bash
cd server
npm start
```

---

## 🐛 Troubleshooting

### Issue: "Node.js is not installed"
**Solution:**
- Download and install from https://nodejs.org/
- Restart command prompt after installation
- Verify: `node --version`

### Issue: "npm ERR! code EACCES: permission denied"
**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Set npm permissions (Windows)
# Or run setup again as Administrator
```

### Issue: "Cannot find module 'concurrently'"
**Solution:**
```bash
cleanup.bat
# OR manually:
npm install -g concurrently
```

### Issue: "Port 3000/4000 already in use"
**Solution:**
```bash
# Find and kill process using the port
netstat -ano | findstr ":3000"
taskkill /PID <PID> /F
```

### Issue: "Ganache connection failed"
**Solution:**
1. Ensure Ganache is running: `ganache-cli --host 127.0.0.1 --port 7545`
2. Check firewall allows port 7545
3. Verify truffle-config.js has correct port (7545)

### Issue: "Smart contract deployment fails"
**Solution:**
1. Ensure Ganache is running with fresh workspace
2. Delete build folder: `rmdir /s build`
3. Recompile and redeploy:
   ```bash
   truffle compile
   truffle migrate --reset --network development
   ```

### Issue: "MetaMask connection issues"
**Solution:**
1. Verify custom RPC network: `http://127.0.0.1:7545`
2. Check Chain ID matches Ganache (usually 5777)
3. Import account from Ganache private key
4. Reset MetaMask account: Settings → Advanced → Reset Account

### Issue: "Module not found errors"
**Solution:**
```bash
cleanup.bat
# This will remove node_modules and reinstall everything
```

---

## 📊 Project File Structure

```
edublocks-app/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # CSS files
│   │   ├── contracts/       # Compiled smart contracts (generated)
│   │   └── App.js
│   └── package.json
├── server/                  # Node.js backend
│   ├── models/              # Database models
│   ├── routes/              # API endpoints
│   ├── index.js             # Main server file
│   └── package.json
├── contracts/               # Solidity smart contracts
│   ├── Edublocks.sol
│   ├── EdublocksToken.sol
│   └── EdublocksTokenSale.sol
├── migrations/              # Truffle migrations
├── truffle-config.js        # Truffle configuration
├── setup-windows.bat        # Setup script
├── run-dev.bat              # Start development servers
├── deploy-contracts.bat     # Deploy smart contracts
└── cleanup.bat              # Clean and reinstall
```

---

## 🔒 Environment Variables (Optional)

Create `.env` file in `server/` directory:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/edublocks
NODE_ENV=development
```

Create `.env.local` in `client/` directory:
```
REACT_APP_SERVER_URL=http://localhost:4000
```

---

## 📝 Useful Commands

```bash
# Start everything
npm run dev

# Start only client
cd client && npm start

# Start only server
cd server && npm start

# Deploy contracts
truffle migrate --network development

# Reset contracts (delete build and recompile)
truffle migrate --reset --network development

# Clean and reinstall dependencies
cleanup.bat

# View npm packages installed
npm list

# Check for outdated packages
npm outdated

# Update packages
npm update
```

---

## 🔄 Development Workflow

### 1. Start Ganache
```bash
ganache-cli --host 127.0.0.1 --port 7545
```

### 2. Deploy Smart Contracts (First time only)
```bash
deploy-contracts.bat
```

### 3. Start Development Servers
```bash
run-dev.bat
```

### 4. Develop
- Edit React components in `client/src/components/`
- Edit styles in `client/src/styles/`
- Edit backend routes in `server/routes/`
- Changes auto-reload (no restart needed)

### 5. Testing Smart Contract Changes
```bash
# Recompile and redeploy contracts
truffle migrate --reset --network development
# Refresh browser page
```

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Project dependencies installed (no errors in setup script)
- [ ] Ganache running and accessible
- [ ] Smart contracts deployed
- [ ] Client running at http://localhost:3000
- [ ] Server running at http://localhost:4000
- [ ] MetaMask installed and configured
- [ ] Can connect wallet in application
- [ ] Can navigate between pages without errors

---

## 📞 Support

For issues not covered here:

1. Check the error message carefully
2. Review the Troubleshooting section
3. Check Truffle documentation: https://trufflesuite.com/docs/
4. Check React documentation: https://reactjs.org/
5. Create an issue with:
   - Error message (full text)
   - Steps to reproduce
   - Your system info (Windows version, Node version)
   - Screenshots if possible

---

## 🚀 Next Steps After Setup

1. **Familiarize with the codebase**
   - Review smart contracts in `contracts/`
   - Explore React components
   - Check API routes in `server/routes/`

2. **Test the features**
   - Create student account
   - Create educator account
   - Add courses
   - Buy tokens
   - Submit assignments

3. **Customize**
   - Update styling in CSS files
   - Modify smart contracts
   - Add new features
   - Configure databases

4. **Deploy to testnet** (later)
   - Use Infura for testnet RPC
   - Deploy to Ropsten, Rinkeby, or Goerli
   - Update MetaMask for testnet

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🎉 You're All Set!

Your Edublocks development environment is ready. Happy coding!

For the latest updates, visit the project repository.
