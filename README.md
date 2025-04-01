# Fake Product Detection System

A decentralized application (dApp) built with Next.js and ThirdWeb for detecting and verifying product authenticity using blockchain technology.

## 🚀 Features

- Modern UI built with Next.js and Tailwind CSS
- Firebase Authentication and Firestore integration
- ThirdWeb contract integration for blockchain functionality
- Smart contract deployed on Sepolia Mumbai testnet
- Responsive design with Radix UI components

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 15.2.4
- **UI Components**: 
  - Radix UI (Dropdown Menu, Label, Radio Group, Slot, Tabs)
  - Tailwind CSS
  - Lucide React Icons
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Blockchain**: 
  - ThirdWeb SDK
  - Sepolia Mumbai Testnet
  - Hardhat for smart contract development

## 📦 Dependencies

### Core Dependencies
- `@thirdweb-dev/contracts`: ^3.8.0
- `@thirdweb-dev/react`: ^4.9.4
- `@thirdweb-dev/sdk`: ^4.0.99

### Development Dependencies
- `hardhat`: ^2.19.1

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Create a `.env.local` file with your Firebase and ThirdWeb credentials
4. Run the development server:
   ```bash
   npm run dev
   ```

## 📝 Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run build:contract`: Detect ThirdWeb contracts
- `npm run deploy:contract`: Deploy ThirdWeb contracts
- `npm run publish:contract`: Publish ThirdWeb contracts

## 🔄 Project Status

### Completed
- ✅ Smart contract development in Solidity
- ✅ Contract deployment on Sepolia Mumbai testnet via ThirdWeb SDK
- ✅ Basic project setup with Next.js and Firebase
- ✅ UI components and styling implementation

### In Progress
- 🔄 Frontend Integration with Smart Contract
  - Connect UI with deployed contract
  - Implement contract interaction methods
  - Add transaction handling
  - Implement product verification flow

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
