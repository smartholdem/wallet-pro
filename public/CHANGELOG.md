v1.2.20
- Added a build process for a cross-browser (Chrome, Firefox, Brave) extension.
- Created an npm script (`build:extension`) to automate the extension build.
- Drop area fix
- Migrated Android build from Cordova to Capacitor for improved performance, stability, and modern API access.
- Refactored Android build process with new `cap:android` and `cap:build:release` npm scripts.
- Re-implemented file download functionality using Capacitor Filesystem API to fix save errors on modern Android versions.
- Replaced JavaScript alerts with native Toast notifications on mobile for better user experience.
- Prefixed filenames with `STEG-` for saved steganography images.
- Configured native Android project:
    - Set screen orientation to portrait-only.
    - Fixed status bar overlap issues by applying correct padding.
    - Replaced default app icon with the custom SmartHoldem icon set.
- **Steganography Tool:**
    - Implemented a tool to embed and extract hidden messages in images using the LSB method.
    - Added the ability to encrypt embedded data with AES-256 using a user-provided password.
    - Integrated a password-protected decryption process for extracted data.
    - Enhanced UI with image resolution, max capacity display, and a capacity warning.

v1.2.19
- Added Cordova project to build for the Android platform.
- Added npm script to automate Android release APK generation.
- Improved responsive layout on the SmartNotes page for the actions menu and notes list.
- Added a responsive view for the SmartNote image modal on mobile devices.
- Fixed bugs related to SmartNote image display and download on mobile.
- Added a QR code display modal for SmartNotes.
- Detect QR Code from image file upload in Send modal.
- Added support for pasting QR code images from clipboard in Send modal.
- Improved Operations UI by moving secondary actions ('Vote', 'Delegate Reg', 'Sign Message') into a new 'Additional' dropdown menu.
- Added internationalization support for the new 'Additional' dropdown.
- Fixed a display issue where the new dropdown appeared underneath other elements.
- Added new 'Smart Notes' section for creating, activating, and managing private codes.
- Added internationalization (i18n) support for the 'Smart Notes' page.
- Added 'copy to clipboard' functionality for SmartNote codes.
- Improved carousel UI in the sidebar: fixed arrow colors and enabled autoplay.
- Fixed a bug causing toast notifications to crash in the Address page.
- Fixed an issue with incorrect event handling for copy-to-clipboard actions.
- Fixed click area for the 'Show Private Key' button on the Address page.
- New users now get their first STH address created automatically upon PIN registration.
- Added support for `sth:` URI scheme to initiate payments from external links (`sth:<address>?amount=...`)
- The app now handles payment links, opening the send modal if the user is on an address page
- Replaced `electron-updater` auto-update with a simpler, non-blocking update notification
- The app now checks for new versions on GitHub and displays notification in the title bar
- Installer update
- Deps update
- Update nodes on pin code setting change
- Fixed minor bugs
- Added a translations
- Added fast installation for Windows
- Added Cold address methods

v1.2.18
- Refactored and moved the QR code and secret key modals from the Operations component to the Address page.
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
- Integrated the address book into the exchange modal (Sell STH) for quick USDT address selection.
- Added a check for the maximum STH buy amount based on the hot wallet balance.
- Added a new 'Vanity Address' page with a multi-threaded generator to find custom STH addresses.
- Added auto-update functionality for the Electron application.
- Displayed STH/USDT exchange rate in the application title bar.
- Displayed STH/USDT exchange rate in the browser tab title for the web version.
- Implemented automatic selection of the best network node and added a network status indicator in the header.

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

