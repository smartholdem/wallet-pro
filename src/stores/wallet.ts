import { defineStore } from "pinia";
import { generateMnemonic, validateMnemonic } from "bip39";
import { Identities } from "@smartholdem/crypto";
import {Connection} from "@smartholdem/client";

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
    addressFromPassword(secret: string) {
      const isBip39 = validateMnemonic(secret);
      const address = Identities.Address.fromPassphrase(secret, 63);
      return {
        isBip39: isBip39,
        address: address,
      }
    }
  },
  persist: true,
});
