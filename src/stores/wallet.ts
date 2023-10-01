import { defineStore } from "pinia";
import { generateMnemonic, validateMnemonic } from "bip39";
import { Transactions, Managers, Utils, Identities } from "@smartholdem/crypto";
import { Connection } from "@smartholdem/client";
import CryptoJS from "crypto-js";
import axios from "axios";
import { useStoreSettings } from '@/stores/app-settings.ts';
const storeSettings = useStoreSettings()
const activeNode = "https://" + storeSettings.nodes[0] + "/api";


const client = new Connection(activeNode);
Managers.configManager.setFromPreset("mainnet");
Managers.configManager.setHeight(1);

export const useStoreWallet = defineStore("walletStorage", {
  state: () => ({
    accounts: {},
    attributes: {},
    transactions: {}
  }),
  actions: {
    async getAttributes(address) {
      const result = {};
      result[address] = {};
      try {
        result[address] = (await axios.get(activeNode + '/wallets/' + address)).data.data;
      } catch(e) {
        console.log('err: address not found');
      }
      this.attributes = {
        ...this.attributes,
        ...result
      }
      return result
    },
    async addressNew() {
      const mnemonic = generateMnemonic();
      return {
        secret: mnemonic,
        address: Identities.Address.fromPassphrase(mnemonic, 63)
      };
    },
    async addressSave(payload: object) {
      this.accounts = {
        ...this.accounts,
        ...payload
      };
    },
    addressDelete(address) {
      const keys = Object.keys(this.accounts);
      let accounts = {};
      for (let i = 0; i < keys.length; i++) {
        accounts[keys[i]] = this.accounts[keys[i]];
      }
      delete accounts[address];
      this.accounts = accounts;
    },
    async addressDecrypt(payload: object) {
      const hash = CryptoJS.SHA384(payload.pin).toString();
      const accountBytes = CryptoJS.AES.decrypt(payload.secret.toString(), payload.pin + hash);
      return accountBytes.toString(CryptoJS.enc.Utf8);
    },
    addressFromPassword(secret: string) {
      const isBip39 = validateMnemonic(secret);
      const address = Identities.Address.fromPassphrase(secret, 63);
      return {
        isBip39: isBip39,
        address: address
      };
    }
  },
  persist: true
});
