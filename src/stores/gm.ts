import { defineStore } from "pinia";
import axios from "axios";
import { useStoreWallet } from "@/stores/wallet";

const GM_API_URL = "http://localhost:3302/gm"; //test dev

type GmDep = {
    address: string;
    idx: number;
    add: number;
    tx: string;
}

type GmSig = {
    pubKey: string;
    signature: string;
}

type GmPayout = {
    tx: string;
    amount: number;
}

type GmAccount = {
    uid: string;
    inviter: string;
    balance: number;
    dep?: GmDep;
    sig?: GmSig;
    payout?: GmPayout;
};

export const useGMStore = defineStore("gm", {
    state: () => ({
        accounts: {} as Record<string, GmAccount>,
        transactions: {} as Record<string, any>,
    }),
    getters: {
        apiUrl: () => GM_API_URL,

    },
    actions: {
        async checkLinkAccount(accountId: string) {
            const storeWallet = useStoreWallet();
            // Убедимся, что у нас есть атрибуты кошелька, особенно публичный ключ.
            if (!storeWallet.attributes[accountId] || !storeWallet.attributes[accountId].publicKey) {
                await storeWallet.getAttributes(accountId);
            }

            const publicKey = storeWallet.attributes[accountId]?.publicKey;

            if (!publicKey) {
                console.error("Не удалось получить публичный ключ для адреса:", accountId);
                // TODO: Обработать эту ошибку в UI
                return;
            }

            const message = 'account-link-' + accountId;
            await this.accountLink(accountId, message, publicKey);
        },

        async accountLink(accountId: string, message: string, publicKey: string) {
            const storeWallet = useStoreWallet();
            try {
                const payload = {
                    address: accountId,
                    message: message,
                };
                const { signature } = await storeWallet.signMessageSchnorr(payload);

                const response = await axios.post(`${GM_API_URL}/account-link`, {
                    address: accountId,
                    message: message,
                    signature: signature,
                    publicKey: publicKey,
                });

                if (response.data && response.data.success) {
                    this.accounts[accountId] = response.data.account;
                    console.log("Account link successfully", this.accounts[accountId]);
                } else {
                    console.error("Account link failed:", response.data);
                }

            } catch (error) {
                console.error("Error fetching account:", error);
            }}
    }
})