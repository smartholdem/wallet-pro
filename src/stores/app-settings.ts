import { defineStore } from "pinia";
//import { useStorage } from "@vueuse/core";
import CryptoJS from 'crypto-js'

export const useStoreSettings = defineStore('appSettings', {
  state: () => ({
    settings: {
      darkMode: true,
      advancedMode: false,
      language: "",
      currency: "USDT",
      lockScreen: 600,
      pinCode: "",
    },
    tmpPin: "",
    nodes: [
      "node0.smartholdem.io",
      "node1.smartholdem.io",
      "testnet02ru.smartholdem.io",
    ],
    activeNode: "node1.smartholdem.io",
  }),
  actions: {
    updateSettings(partialSettings: object) {
      this.settings = {
        ...this.settings,
        ...partialSettings,
      };
      //localStorage.setItem('appSettings', JSON.stringify(this.settings))
    },
    savePinCode(pin: string) {
      this.settings.pinCode = CryptoJS.SHA384(pin).toString();
      //console.log('sha384', this.settings.pinCode)
    },
    validatePinCode(password: string) {
      const pinSha384 = CryptoJS.SHA384(password).toString();
      return pinSha384 === this.settings.pinCode;
    },
  },
  persist: true,
});
