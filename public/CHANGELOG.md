v1.2.18
- Implemented dynamic price calculation for swaps, including slippage and price impact.
- Added notifications for new incoming transactions on the address page.
- Added UI for STH/USDT exchange.
- Implemented STH selling functionality.
- Integrated `vue-i18n` for internationalization.
- Refactored and cleaned up localization files, removing duplicate keys.
- Replaced static labels with translation keys in the transfer modal window.
- Added a "What's New" changelog modal shown after app updates.
- Implemented a backend endpoint to fetch real-time STH/USDT exchange rates.
- Integrated live exchange rates into the exchange modal.
- Added display of USDT equivalent value for the account balance.
- Added and internationalized the new Settings page.
- Minor UI/UX improvements in the exchange modal.
- Refactored `ExchangeModal.vue` to use the `exchange.ts` store for the backend URL.
- Dynamically set the `EXCHANGE_API_URL` based on the environment (Electron/Web).
- Added a check for the exchange server availability and disabled the "Exchange" button if it's not available.
- Added a button to copy the private key to the clipboard with a security warning.
- Added copy and delete buttons for each entry in the address book.
- Integrated the address book into the send modal for quick recipient selection.

v1.2.17
- Add support 7 languages

v1.2.16
- Add desktop app (Electron)
- Fix bugs
- Update dependencies
- Add 24 words support BIP39 
- Update theme thumbs

v1.2.15
- Fix decrypt/encrypt private keys
- Update storage logic
- Add multi payments transactions & ui
- Init Telegram API

v1.2.12
- ADD TON Cross-Chain transfers for SmartHoldem STH

v1.2.3
- Create crypto signature message with Schnorr
- Validate crypto signature message with Schnorr
- Remove HECO network from wallet

v1.2.2
- delegate register
- voting

v1.2.1
- move transfer in modal window
- fix fonts
- change scroll bars color

v1.2.0
- wait transaction with 0 confirmations
- status transaction success or error
- mobile view transactions list
- component list transactions
- explorer onclick txId, address
- address book
- operation component
- notifications
- clipboard copy
- label in address new & import
- copy new address data to clipboard
- telegram airdrop icon in tx

v1.1.0
- cross chain support XBTS DEX (BitShares) 
- QR code for receive STH
- reload update date
- cross chain networks MainNet, BSC, HECO
- validate nodes status
- mobile mode transactions list
- cross chains icons in transactions

v1.0.0

- Rabbit crypto & AES
- encrypted methods select
- links Explorer, Full Screen, Git 
- blockchain section and fees
- mobile fixes
- pin code storage fixes
- Reset All data
- full screen mode

