// D:/projects/wallets/wallet-pro/src/workers/vanity.worker.ts
import { Identities } from "@smartholdem/crypto";
import { generateMnemonic } from "bip39";

/**
 * Генерирует новый случайный кошелек SmartHoldem.
 */
function generateWallet() {
    const mnemonic = generateMnemonic();
    const address = Identities.Address.fromPassphrase(mnemonic, 63);
    return { address, secret: mnemonic };
}

// Слушаем сообщения из основного потока
self.onmessage = (event: MessageEvent) => {
    const { term, mode } = event.data;
    const upperCaseTerm = term.toUpperCase();
    let attempts = 0;

    // Бесконечный цикл генерации и проверки
    while (true) {
        attempts++;
        const wallet = generateWallet();
        const address = wallet.address;
        let isMatch = false;

        switch (mode) {
            case 'suffix':
                isMatch = address.toUpperCase().endsWith(upperCaseTerm);
                break;
            case 'contains':
                isMatch = address.toUpperCase().includes(upperCaseTerm);
                break;
            case 'prefix':
            default:
                // Адреса начинаются с 'S', поэтому ищем после первого символа.
                isMatch = address.substring(1).toUpperCase().startsWith(upperCaseTerm);
                break;
        }

        // Если нашли совпадение
        if (isMatch) {
            // Отправляем результат в основной поток
            self.postMessage({ status: 'found', wallet, attempts });
            // Завершаем работу воркера
            self.close();
            break;
        }

        // Периодически отправляем прогресс
        if (attempts % 5000 === 0) {
            self.postMessage({ status: 'progress', attempts });
            attempts = 0; // Сбрасываем счетчик для этого отчета, чтобы не суммировать в главном потоке
        }
    }
};
