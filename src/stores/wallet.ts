import { defineStore } from "pinia";
import { generateMnemonic, validateMnemonic } from "bip39";
import { Identities } from "@smartholdem/crypto";
import { Connection } from "@smartholdem/client";
import CryptoJS from 'crypto-js'

export const useStoreWallet = defineStore("WalletStorage", {
  state: () => ({
    accounts: {},
  }),
  actions: {
    async addressNew() {
      const mnemonic = generateMnemonic();
      return {
        secret: mnemonic,
        address: Identities.Address.fromPassphrase(mnemonic, 63)
      };
    },
    async addressSave(payload: object) {
      console.log(payload)
      this.accounts = {
        ...this.accounts,
        ...payload,
      };
    },
    async addressDecrypt(payload: object) {
      const hash = CryptoJS.SHA384(payload.pin).toString();
      const accountBytes = CryptoJS.AES.decrypt(payload.secret.toString(), payload.pin + hash)
      return accountBytes.toString(CryptoJS.enc.Utf8)
    },
    addressFromPassword(secret: string) {
      const isBip39 = validateMnemonic(secret);
      const address = Identities.Address.fromPassphrase(secret, 63);
      return {
        isBip39: isBip39,
        address: address,
      };
    }
  },
  persist: true
});
