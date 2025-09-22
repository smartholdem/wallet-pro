# SmartHoldem Wallet Pro

Una cartera de escritorio segura, rica en funciones y multiplataforma para el ecosistema de la blockchain de SmartHoldem.

![STH_2023_wallet (1)](https://private-user-images.githubusercontent.com/9394904/492080167-794d2965-d7d8-446f-86cc-1d9a26fc33e0.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTg1MDE1MDgsIm5iZiI6MTc1ODUwMTIwOCwicGF0aCI6Ii85Mzk0OTA0LzQ5MjA4MDE2Ny03OTRkMjk2NS1kN2Q4LTQ0NmYtODZjYy0xZDlhMjZmYzMzZTAucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI1MDkyMiUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNTA5MjJUMDAzMzI4WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9ZTQzMTJkMDRmMDdhMmRlOTE1YmRjYTI4ZWRmOGNkZjM2NGVkNTNjMjc0MDcwODQ4YTUzYjEyMDlkOTE3OGZlZiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QifQ.ukhZM617tetwfx9LXy0lmcskRjhvNPQGckN9L4cnZ6o)

## Sobre el Proyecto

SmartHoldem Wallet Pro es la aplicación de escritorio oficial para interactuar con la blockchain de SmartHoldem. Construida con la seguridad y la experiencia del usuario en mente, sirve como una puerta de enlace integral para gestionar activos STH, participar en la red y acceder a funciones de intercambio entre cadenas.

Esta cartera está construida con tecnologías web modernas, incluyendo Vue.js y Pinia, y está envuelta en Electron para proporcionar una experiencia consistente en todos los principales sistemas operativos de escritorio.

## Características Clave

### Funcionalidad Principal de la Cartera
- **Gestión de Carteras:** Cree, importe (a través de mnemónicos BIP39 de 12/24 palabras o claves privadas) y gestione un número ilimitado de carteras.
- **Saldo en Tiempo Real:** Vea el historial detallado de transacciones y los saldos de las cuentas con un valor equivalente en `USDT` en tiempo real.
- **Generador de Direcciones "Vanity":** Cree direcciones de SmartHoldem personalizadas y legibles por humanos (por ejemplo, que comiencen con "STHcool...") utilizando un potente motor de generación multifilamento.
- **Libreta de Direcciones:** Guarde y etiquete de forma segura las direcciones utilizadas con frecuencia para un acceso rápido durante las transferencias e intercambios.
- **Acceso Seguro a Claves:** Vea y copie fácilmente sus claves privadas con las advertencias de seguridad adecuadas.

### Capacidades Avanzadas de Blockchain
- **Swaps Atómicos Cross-Chain:** Intercambie `STH` ↔ `USDT` de forma instantánea y segura a través de una puerta de enlace descentralizada impulsada por la red BitShares.
- **Precios Dinámicos de Swap:** Obtenga las mejores tarifas con cálculo de precios en tiempo real para los swaps, incluyendo la visualización del deslizamiento (slippage) y el impacto en el precio.
- **Multi-Pagos:** Envíe STH hasta a 150 destinatarios en una única y eficiente transacción.
- **Gobernanza de la Red:**
    - **Registro de Delegado:** Regístrese como delegado de la red para ayudar a asegurar la blockchain.
    - **Sistema de Votación:** Participe en el proceso de consenso votando por los delegados de su elección.
- **Mensajería Criptográfica:** Cree y verifique firmas Schnorr para una comunicación segura fuera de la cadena.
- **Soporte de la Red TON:** Incluye soporte para transferencias Cross-Chain que involucran la red TON.
- **Soporte de la Red BSC:** Incluye soporte para transferencias Cross-Chain que involucran la red Binance Smart Chain.

### Experiencia de Usuario Moderna
- **Multiplataforma:** Disfrute de una experiencia consistente en **Windows, macOS y Linux**.
- **Soporte Multilingüe:** Una interfaz totalmente internacionalizada que soporta **7+ idiomas**, incluyendo inglés, ruso, alemán, español y más.
- **Modos Claro y Oscuro:** Elija un tema visual que sea agradable a la vista.
- **Notificaciones en Tiempo Real:** Reciba notificaciones de escritorio instantáneas sobre las transacciones entrantes.
- **Modal "Qué hay de nuevo":** Manténgase informado sobre las últimas funciones y actualizaciones con una ventana emergente automática del registro de cambios después de cada actualización.

### La Seguridad es lo Primero
- **Protección con Código PIN:** Asegure la interfaz de la aplicación con un código PIN local.
- **Almacenamiento Cifrado:** Todos los datos sensibles, incluidas sus claves privadas, se cifran de forma segura en su dispositivo.
- **Gestión Robusta de Conexiones:** Cuenta con una gestión de conexión tolerante a fallos сon cambio automático de nodo para garantizar que siempre esté conectado.

## Plataformas Soportadas

Como aplicación basada en Electron, SmartHoldem Wallet Pro está disponible para:

- Windows
- macOS
- Linux
- Aplicación de Telegram
- Web
