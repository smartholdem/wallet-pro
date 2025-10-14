import { defineStore } from "pinia";
import axios from "axios";
import { useStoreWallet } from "@/stores/wallet";

const GM_API_URL = "http://localhost:3302/gm"; //test dev

type gmAccountRecord = {
    uid: string;
    name: string;
    inviter: string,
    balance: 0,
    pubKey: string,
    updatedAt: string,
    createdAt: string,
    counter: 0,
};

export const useGMStore = defineStore("gm", {
    state: () => ({
        accounts: {} as Record<string, gmAccountRecord>,
        transactions: {} as Record<string, any>,
    }),
    getters: {
        apiUrl: () => GM_API_URL,

    },
    actions: {
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
                this.accounts[accountId] = response.data;
                console.log("Account link successfully", this.accounts);
            } catch (error) {
                console.error("Error fetching account:", error);
            }}
    }
})