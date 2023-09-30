import { defineStore } from "pinia";

export const useStoreWallet = defineStore("WalletStorage", {
  state: () => ({
    accounts: {}
  }),
  actions: {
    walletAdd(options: object) {

    }
  },
  persist: true,
});
