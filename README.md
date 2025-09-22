# SmartHoldem Wallet Pro

A secure, feature-rich, cross-platform desktop wallet for the SmartHoldem blockchain ecosystem.

![STH_2023_wallet (1)](https://private-user-images.githubusercontent.com/9394904/492080167-794d2965-d7d8-446f-86cc-1d9a26fc33e0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTg1MDE1MDgsIm5iZiI6MTc1ODUwMTIwOCwicGF0aCI6Ii85Mzk0OTA0LzQ5MjA4MDE2Ny03OTRkMjk2NS1kN2Q4LTQ0NmYtODZjYy0xZDlhMjZmYzMzZTAucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkyMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MjJUMDAzMzI4WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZTQzMTJkMDRmMDdhMmRlOTE1YmRjYTI4ZWRmOGNkZjM2NGVkNTNjMjc0MDcwODQ4YTUzYjEyMDlkOTE3OGZlZiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.ukhZM617tetwfx9LXy0lmcskRjhvNPQGckN9L4cnZ6o)

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