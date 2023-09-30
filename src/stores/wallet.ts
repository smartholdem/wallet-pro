import { defineStore } from "pinia";
import { generateMnemonic } from "bip39";
import { Identities } from "@smartholdem/crypto";

export const useStoreWallet = defineStore("WalletStorage", {
  state: () => ({
    accounts: {}
  }),
  actions: {
    async getNewAddress() {
      const mnemonic = generateMnemonic();
      return {
        secret: mnemonic,
        address: Identities.Address.fromPassphrase(mnemonic, 63)
      };
    },
    async saveNewAddress(options: object) {
      this.accounts = {
        ...this.accounts,
        ...options
      };
    },
    async addressFromPassword(secret: string) {
      return Identities.Address.fromPassphrase(secret, 63);
    }
  },
  persist: true,
});
