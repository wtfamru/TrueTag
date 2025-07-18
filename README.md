# TrueTag - Blockchain-Based Product Authentication System 🔗

TrueTag is a decentralized application (dApp) that enables manufacturers to register and track their products while allowing customers to verify product authenticity using blockchain technology.

## Features 🚀

### Current Implementation ✅

#### Manufacturer Dashboard 🏭
- **📦 Product Registration**: Register products with unique identifiers combining batch numbers and sequence numbers
- **📊 Product Management**: View and manage registered products with detailed information
- **🔍 Search & Filter**: Search products by ID, batch number, or product name
- **💰 Wallet Integration**: Connect with MetaMask, Coinbase Wallet, or WalletConnect
- **🔐 User Authentication**: Secure login/registration system with Firebase
- **📈 Product Status Tracking**: Monitor claimed/unclaimed status of products

#### Customer Dashboard 🛒
- **✅ Product Verification**: Verify product authenticity by entering product ID
- **🏷️ Product Claims**: Claim ownership of authentic products
- **📋 Ownership Management**: View and manage owned products
- **🟢 Verification States**:
  - Not Registered (🔴 Red): Product not found in the system
  - Not Claimed (🟡 Yellow): Authentic but unclaimed product
  - Claimed by Other (🟡 Yellow): Product owned by another users
  - Authentic (🟢 Green): Product verified and owned by the users

### Smart Contract Features ⛓️
- Product registration with manufacturer details
- Ownership tracking and transfer
- Product verification system
- Batch management
- Timestamp tracking for all operations

## Technical Stack 💻

- **Frontend**: Next.js, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Firebase (Authentication & Database)
- **Blockchain**: Ethereum (Smart Contracts)
- **Web3**: Thirdweb SDK
- **Authentication**: Firebase Auth
- **Styling**: TailwindCSS with custom theme
## Getting Started📋

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_CONTRACT_ADDRESS="your_contract_address"
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Admin SDK Credentials
FIREBASE_CLIENT_EMAIL="your-client-email@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="your-private-key"

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# Thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID="your-thirdweb-client-id"

# Smart Contract Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS="your-contract-address"
```

To set up your environment:
1. Create a Firebase project and get your credentials from the Firebase Console
2. Set up a Thirdweb account and get your client ID
3. Deploy your smart contract and get the contract address
4. Replace all placeholder values with your actual credentials

> **Note**: Never commit your `.env.local` file to version control. Make sure it's included in your `.gitignore` file.
## Future Implementations 🚧

### 1. QR Code Integration 
- **📄 QR Code Generation**: Automated QR code generation for registered products
- **📦 Batch QR Generation**: Generate multiple QR codes for batch products
- **🔍 QR Code Scanning**: In-app QR code scanner for easy product verification
- **🎨 Custom QR Design**: Branded QR codes with manufacturer logos
- **📥 Download Options**: Multiple format options for QR code downloads

### 2. Counterfeit Detection System
- **🚩 Multiple Scan Detection**: Track and flag suspicious scanning patterns
- **🌍 Geographical Tracking**: Monitor product verification locations
- **⚠️ Simultaneous Claims Detection**: Identify multiple claim attempts
- **🔔 Alert System**: Real-time notifications for suspicious activities
- **📊 Analytics Dashboard**: 
  - Scan frequency analysis
  - Geographical distribution of scans
  - Time-based scanning patterns
  - Risk assessment reports
- **🤖 Automated Responses**: 
  - Immediate flagging of suspicious products
  - Notification to manufacturers
  - Optional product lockdown
  - Investigation triggers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

