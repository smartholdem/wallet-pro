# SmartHoldem Wallet Pro

A secure, feature-rich, cross-platform desktop wallet for the SmartHoldem blockchain ecosystem.

![STH_wallet](https://private-user-images.githubusercontent.com/9394904/492080167-794d2965-d7d8-446f-86cc-1d9a26fc33e0.png)

## About The Project

SmartHoldem Wallet Pro is the official desktop application for interacting with the SmartHoldem blockchain. Built with security and user experience in mind, it serves as a comprehensive gateway for managing STH assets, participating in the network, and accessing cross-chain exchange features.

This wallet is built using modern web technologies, including Vue.js and Pinia, and is wrapped in Electron to provide a consistent experience across all major desktop operating systems.

## Key Features

### Core Wallet Functionality
- **Wallet Management:** Create, import (via 12/24-word BIP39 mnemonics or private keys), and manage unlimited wallets.
- **Real-Time Balance:** View detailed transaction history and account balances with a real-time `USDT` equivalent value.
- **Vanity Address Generator:** Create custom, human-readable SmartHoldem addresses (e.g., starting with "STHcool...") using a powerful multi-threaded generation engine.
- **Address Book:** Securely save and label frequently used addresses for quick access during transfers and exchanges.
- **Secure Key Access:** Easily view and copy your private keys with appropriate security warnings.

### Advanced Blockchain Capabilities
- **Cross-Chain Atomic Swaps:** Instantly and securely swap `STH` ↔ `USDT` through a decentralized gateway powered by the BitShares network.
- **Dynamic Swap Pricing:** Get the best rates with real-time price calculation for swaps, including slippage and price impact display.
- **Multi-Payments:** Send STH to up to 150 recipients in a single, efficient transaction.
- **Network Governance:**
    - **Delegate Registration:** Register yourself as a network delegate to help secure the blockchain.
    - **Voting System:** Participate in the consensus process by voting for your chosen delegates.
- **Cryptographic Messaging:** Create and verify Schnorr signatures for secure, off-chain communication.
- **TON Network Support:** Includes support for Cross-Chain transfers involving the TON network.
- **BSC Network Support:** Includes support for Cross-Chain transfers involving the Binance Smart Chain network.

### Modern User Experience
- **Cross-Platform:** Enjoy a consistent experience on **Windows, macOS, and Linux**.
- **Multi-Language Support:** A fully internationalized interface supporting **7+ languages**, including English, Russian, German, Spanish, and more.
- **Light & Dark Modes:** Choose a visual theme that's easy on your eyes.
- **Real-Time Notifications:** Receive instant desktop notifications for incoming transactions.
- **"What's New" Modal:** Stay informed about the latest features and updates with an automatic changelog popup after every update.
- **Auto-Update:** The application now automatically checks for and notifies about new versions.
- **Live Price Ticker:** The current STH/USDT exchange rate is now always visible in the title bar.

### Security First
- **PIN Code Protection:** Secure the application interface with a local PIN code.
- **Encrypted Storage:** All sensitive data, including your private keys, are securely encrypted on your device.
- **Robust Connection Management:** Features fault-tolerant connection handling with automatic node switching to ensure you're always connected.

## Supported Platforms

As an Electron-based application, SmartHoldem Wallet Pro is available for:

- Windows
- macOS
- Linux
- Telegram app
- Web