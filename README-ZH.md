# SmartHoldem Wallet Pro

一款安全、功能丰富、跨平台的桌面钱包，专为 SmartHoldem 区块链生态系统打造。

![STH_2023_wallet (1)](https://private-user-images.githubusercontent.com/9394904/492080167-794d2965-d7d8-446f-86cc-1d9a26fc33e0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTg1MDE1MDgsIm5iZiI6MTc1ODUwMTIwOCwicGF0aCI6Ii85Mzk0OTA0LzQ5MjA4MDE2Ny03OTRkMjk2NS1kN2Q4LTQ0NmYtODZjYy0xZDlhMjZmYzMzZTAucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkyMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MjJUMDAzMzI4WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZTQzMTJkMDRmMDdhMmRlOTE1YmRjYTI4ZWRmOGNkZjM2NGVkNTNjMjc0MDcwODQ4YTUzYjEyMDlkOTE3OGZlZiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.ukhZM617tetwfx9LXy0lmcskRjhvNPQGckN9L4cnZ6o)

## 关于项目

SmartHoldem Wallet Pro 是用于与 SmartHoldem 区块链交互的官方桌面应用程序。它以安全和用户体验为核心，是管理 STH 资产、参与网络和访问跨链交易功能的全方位网关。

该钱包采用现代 Web 技术构建，包括 Vue.js 和 Pinia，并使用 Electron 进行封装，以在所有主流桌面操作系统上提供一致的体验。

## 主要特点

### 核心钱包功能
- **钱包管理：** 创建、导入（通过 12/24 位 BIP39 助记词或私钥）和管理无限数量的钱包。
- **实时余额：** 查看详细的交易历史和账户余额，并提供实时的 `USDT` 等值显示。
- **靓号地址生成器：** 使用强大的多线程生成引擎，创建自定义的、人类可读的 SmartHoldem 地址（例如，以“STHcool...”开头）。
- **地址簿：** 安全地保存和标记常用地址，以便在转账和交易中快速访问。
- **安全密钥访问：** 在适当的安全警告下，轻松查看和复制您的私钥。

### 高级区块链功能
- **跨链原子交换：** 通过由 BitShares 网络驱动的去中心化网关，即时、安全地交换 `STH` ↔ `USDT`。
- **动态交换定价：** 通过交换的实时价格计算获得最佳汇率，包括滑点和价格影响显示。
- **批量支付：** 在单笔交易中高效地将 STH 发送给多达 150 个接收者。
- **网络治理：**
    - **节点注册：** 注册成为网络节点，以帮助保护区块链的安全。
    - **投票系统：** 通过为您选择的节点投票来参与共识过程。
- **加密消息：** 创建和验证 Schnorr 签名，用于安全的链下通信。
- **支持 TON 网络：** 包括对涉及 TON 网络的跨链转账的支持。
- **支持 BSC 网络：** 包括对涉及币安智能链网络的跨链转账的支持。

### 现代用户体验
- **跨平台：** 在 **Windows、macOS 和 Linux** 上享受一致的体验。
- **多语言支持：** 完全国际化的界面，支持 **7种以上语言**，包括英语、俄语、德语、西班牙语等。
- **浅色和深色模式：** 选择一个让您眼睛舒适的视觉主题。
- **实时通知：** 接收有关收款交易的即时桌面通知。
- **“新增功能”弹窗：** 每次更新后，通过自动弹出的更新日志，随时了解最新的功能和更新。

### 安全第一
- **PIN 码保护：** 使用本地 PIN 码保护应用程序界面。
- **加密存储：** 包括您的私钥在内的所有敏感数据都在您的设备上进行安全加密。
- **强大的连接管理：** 具有容错连接处理功能和自动节点切换功能，确保您始终保持连接。

## 支持的平台

作为一款基于 Electron 的应用程序，SmartHoldem Wallet Pro 可用于：

- Windows
- macOS
- Linux
- Telegram 应用
- 网页版
