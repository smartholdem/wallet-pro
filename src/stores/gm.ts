import { defineStore } from "pinia";
import axios from "axios";

const GM_API_URL = "http://localhost:3302/gm"; //test dev

type gmAccountRecord = {
    name: string;
    accountId: string;
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
        async fetchAccount(accountId: string)  {
            try {
                const response = await axios.get(`${GM_API_URL}/account/${accountId}`);
                this.accounts[accountId] = response.data;
            } catch (error) {
                console.error("Error fetching account:", error);
            }}
    }
})